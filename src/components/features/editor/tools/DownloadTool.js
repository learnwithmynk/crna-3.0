/**
 * DownloadTool - Custom Editor.js Block
 *
 * Creates download buttons that respect user entitlements.
 * Fetches available downloads from Supabase and renders download buttons.
 */

const DOWNLOAD_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>';

export default class DownloadTool {
  /**
   * Editor.js API
   */
  static get toolbox() {
    return {
      title: 'Download',
      icon: DOWNLOAD_ICON,
    };
  }

  /**
   * Constructor
   */
  constructor({ data, api, config, block }) {
    this.api = api;
    this.config = config;
    this.block = block;

    // Config can include available downloads
    this.availableDownloads = config.downloads || [];

    this.data = {
      downloadId: data.downloadId || null,
      title: data.title || '',
      description: data.description || '',
      fileUrl: data.fileUrl || '',
      fileType: data.fileType || '',
      fileSize: data.fileSize || '',
      entitlementSlug: data.entitlementSlug || null,
    };

    this.wrapper = null;
  }

  /**
   * Render the block in the editor
   */
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('download-block');

    if (!this.data.downloadId) {
      this._renderPicker();
    } else {
      this._renderDownloadCard();
    }

    return this.wrapper;
  }

  /**
   * Render download picker
   */
  _renderPicker() {
    this.wrapper.innerHTML = '';
    this.wrapper.style.cssText = `
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
    `;

    const label = document.createElement('div');
    label.textContent = 'Select a download:';
    label.style.cssText = 'font-weight: 500; margin-bottom: 12px;';
    this.wrapper.appendChild(label);

    // If downloads provided via config, show picker
    if (this.availableDownloads.length > 0) {
      const list = document.createElement('div');
      list.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

      this.availableDownloads.forEach((download) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.style.cssText = `
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #f9fafb;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s;
        `;
        item.innerHTML = `
          <span style="font-size: 24px;">${this._getFileIcon(download.file_type)}</span>
          <div style="flex: 1;">
            <div style="font-weight: 500;">${download.title}</div>
            <div style="font-size: 12px; color: #6b7280;">${download.file_type?.toUpperCase() || 'File'} • ${this._formatFileSize(download.file_size)}</div>
          </div>
        `;

        item.addEventListener('click', () => {
          this.data = {
            downloadId: download.id,
            title: download.title,
            description: download.description || '',
            fileUrl: download.file_url,
            fileType: download.file_type,
            fileSize: download.file_size,
            entitlementSlug: download.entitlement_slug,
          };
          this._renderDownloadCard();
        });

        item.addEventListener('mouseenter', () => {
          item.style.borderColor = '#3b82f6';
          item.style.background = '#eff6ff';
        });
        item.addEventListener('mouseleave', () => {
          item.style.borderColor = '#e5e7eb';
          item.style.background = '#f9fafb';
        });

        list.appendChild(item);
      });

      this.wrapper.appendChild(list);
    } else {
      // Manual entry mode
      this._renderManualEntry();
    }

    // Manual entry toggle
    const manualBtn = document.createElement('button');
    manualBtn.type = 'button';
    manualBtn.textContent = '+ Enter manually';
    manualBtn.style.cssText = `
      margin-top: 12px;
      padding: 8px;
      border: 1px dashed #d1d5db;
      border-radius: 6px;
      background: transparent;
      color: #6b7280;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
    `;
    manualBtn.addEventListener('click', () => this._renderManualEntry());

    if (this.availableDownloads.length > 0) {
      this.wrapper.appendChild(manualBtn);
    }
  }

  /**
   * Render manual entry form
   */
  _renderManualEntry() {
    this.wrapper.innerHTML = '';
    this.wrapper.style.cssText = `
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
    `;

    const form = document.createElement('div');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

    // Title
    form.appendChild(this._createInput('Title', this.data.title, (val) => { this.data.title = val; }));
    // Description
    form.appendChild(this._createInput('Description', this.data.description, (val) => { this.data.description = val; }));
    // File URL
    form.appendChild(this._createInput('File URL', this.data.fileUrl, (val) => { this.data.fileUrl = val; }));
    // File Type
    form.appendChild(this._createInput('File Type (pdf, xlsx, etc.)', this.data.fileType, (val) => { this.data.fileType = val; }));

    // Done button
    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.textContent = 'Done';
    doneBtn.style.cssText = `
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-weight: 500;
    `;
    doneBtn.addEventListener('click', () => {
      if (this.data.title && this.data.fileUrl) {
        this.data.downloadId = `manual-${Date.now()}`;
        this._renderDownloadCard();
      }
    });
    form.appendChild(doneBtn);

    this.wrapper.appendChild(form);
  }

  /**
   * Render download card display
   */
  _renderDownloadCard() {
    this.wrapper.innerHTML = '';
    this.wrapper.style.cssText = `
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: linear-gradient(135deg, #f9fafb 0%, white 100%);
    `;

    // File icon
    const iconEl = document.createElement('div');
    iconEl.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #fef3c7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    `;
    iconEl.textContent = this._getFileIcon(this.data.fileType);

    // Content
    const content = document.createElement('div');
    content.style.cssText = 'flex: 1; min-width: 0;';
    content.innerHTML = `
      <div style="font-weight: 600; color: #1f2937;">${this.data.title}</div>
      ${this.data.description ? `<div style="font-size: 14px; color: #6b7280; margin-top: 2px;">${this.data.description}</div>` : ''}
      <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">
        ${this.data.fileType?.toUpperCase() || 'File'}
        ${this.data.fileSize ? ` • ${this._formatFileSize(this.data.fileSize)}` : ''}
        ${this.data.entitlementSlug ? ` • Requires: ${this.data.entitlementSlug}` : ''}
      </div>
    `;

    // Download button (preview in editor)
    const downloadBtn = document.createElement('div');
    downloadBtn.style.cssText = `
      padding: 8px 16px;
      border-radius: 6px;
      background: #f6ff88;
      color: #1f2937;
      font-weight: 500;
      font-size: 14px;
      cursor: default;
      flex-shrink: 0;
    `;
    downloadBtn.textContent = 'Download';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.innerHTML = '✏️';
    editBtn.style.cssText = `
      padding: 4px 8px;
      border: none;
      background: transparent;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.15s;
    `;
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._renderPicker();
    });
    editBtn.addEventListener('mouseenter', () => { editBtn.style.opacity = '1'; });
    editBtn.addEventListener('mouseleave', () => { editBtn.style.opacity = '0.5'; });

    this.wrapper.appendChild(iconEl);
    this.wrapper.appendChild(content);
    this.wrapper.appendChild(downloadBtn);
    this.wrapper.appendChild(editBtn);
  }

  /**
   * Create labeled input
   */
  _createInput(label, value, onChange) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label style="display: block; font-size: 12px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">${label}</label>
    `;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value || '';
    input.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
    `;
    input.addEventListener('input', (e) => onChange(e.target.value));
    wrapper.appendChild(input);
    return wrapper;
  }

  /**
   * Get file icon based on type
   */
  _getFileIcon(type) {
    const icons = {
      pdf: '📄',
      xlsx: '📊',
      xls: '📊',
      doc: '📝',
      docx: '📝',
      zip: '🗜️',
      mp4: '🎬',
      mp3: '🎵',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
    };
    return icons[type?.toLowerCase()] || '📁';
  }

  /**
   * Format file size
   */
  _formatFileSize(bytes) {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  /**
   * Extract data from the block
   */
  save() {
    return {
      downloadId: this.data.downloadId,
      title: this.data.title,
      description: this.data.description,
      fileUrl: this.data.fileUrl,
      fileType: this.data.fileType,
      fileSize: this.data.fileSize,
      entitlementSlug: this.data.entitlementSlug,
    };
  }

  /**
   * Validate block data
   */
  validate(savedData) {
    return savedData.downloadId && savedData.title;
  }
}
