/**
 * LinkCardTool - Custom Editor.js Block
 *
 * Creates link cards for internal app navigation.
 * Shows title, description, and icon for app sections.
 */

/**
 * Predefined app sections for quick linking
 */
const APP_SECTIONS = [
  { path: '/dashboard', title: 'Dashboard', description: 'Return to your dashboard', icon: 'home' },
  { path: '/schools', title: 'School Database', description: 'Browse CRNA programs', icon: 'school' },
  { path: '/my-programs', title: 'My Programs', description: 'View your target programs', icon: 'target' },
  { path: '/trackers', title: 'Trackers', description: 'Track your progress', icon: 'chart' },
  { path: '/my-stats', title: 'My Stats', description: 'View your profile stats', icon: 'user' },
  { path: '/learn', title: 'Learning Library', description: 'Browse learning modules', icon: 'book' },
  { path: '/tools', title: 'Tools', description: 'Access application tools', icon: 'tool' },
  { path: '/prerequisites', title: 'Prerequisites', description: 'Check prerequisite courses', icon: 'checklist' },
  { path: '/marketplace', title: 'Marketplace', description: 'Find SRNA mentors', icon: 'users' },
  { path: '/events', title: 'Events', description: 'View upcoming events', icon: 'calendar' },
];

/**
 * Simple icon SVGs
 */
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
  school: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
  checklist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
};

export default class LinkCardTool {
  /**
   * Editor.js API
   */
  static get toolbox() {
    return {
      title: 'Link Card',
      icon: ICONS.link,
    };
  }

  /**
   * Constructor
   */
  constructor({ data, api, config, block }) {
    this.api = api;
    this.config = config;
    this.block = block;

    this.data = {
      path: data.path || '',
      title: data.title || '',
      description: data.description || '',
      icon: data.icon || 'link',
    };

    this.wrapper = null;
  }

  /**
   * Render the block in the editor
   */
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('link-card-block');
    this.wrapper.style.cssText = `
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      background: white;
    `;

    // If no data, show section picker
    if (!this.data.path) {
      this._renderPicker();
    } else {
      this._renderCard();
    }

    return this.wrapper;
  }

  /**
   * Render section picker
   */
  _renderPicker() {
    const picker = document.createElement('div');
    picker.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    const label = document.createElement('div');
    label.textContent = 'Select a section to link:';
    label.style.cssText = 'font-weight: 500; margin-bottom: 8px;';
    picker.appendChild(label);

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;';

    APP_SECTIONS.forEach((section) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: #f9fafb;
        cursor: pointer;
        text-align: left;
        transition: all 0.15s;
      `;
      button.innerHTML = `
        <span style="width: 20px; height: 20px; color: #6b7280;">${ICONS[section.icon]}</span>
        <span style="font-size: 14px;">${section.title}</span>
      `;

      button.addEventListener('click', () => {
        this.data = { ...section };
        this._renderCard();
      });

      button.addEventListener('mouseenter', () => {
        button.style.borderColor = '#3b82f6';
        button.style.background = '#eff6ff';
      });
      button.addEventListener('mouseleave', () => {
        button.style.borderColor = '#e5e7eb';
        button.style.background = '#f9fafb';
      });

      grid.appendChild(button);
    });

    // Custom URL option
    const customBtn = document.createElement('button');
    customBtn.type = 'button';
    customBtn.textContent = '+ Custom URL';
    customBtn.style.cssText = `
      grid-column: span 2;
      padding: 8px;
      border: 1px dashed #d1d5db;
      border-radius: 6px;
      background: transparent;
      color: #6b7280;
      cursor: pointer;
      font-size: 14px;
    `;
    customBtn.addEventListener('click', () => {
      this.data = { path: '/custom', title: 'Custom Link', description: 'Enter description', icon: 'link' };
      this._renderCardEditable();
    });
    grid.appendChild(customBtn);

    picker.appendChild(grid);
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(picker);
  }

  /**
   * Render the link card (display mode)
   */
  _renderCard() {
    this.wrapper.innerHTML = '';
    this.wrapper.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: linear-gradient(135deg, #f9fafb 0%, white 100%);
      cursor: pointer;
      transition: all 0.15s;
    `;

    // Icon
    const iconEl = document.createElement('div');
    iconEl.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      flex-shrink: 0;
    `;
    iconEl.innerHTML = `<span style="width: 24px; height: 24px;">${ICONS[this.data.icon] || ICONS.link}</span>`;

    // Content
    const content = document.createElement('div');
    content.style.cssText = 'flex: 1; min-width: 0;';
    content.innerHTML = `
      <div style="font-weight: 600; color: #1f2937;">${this.data.title}</div>
      <div style="font-size: 14px; color: #6b7280;">${this.data.description}</div>
      <div style="font-size: 12px; color: #3b82f6; margin-top: 4px;">${this.data.path}</div>
    `;

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
    this.wrapper.appendChild(editBtn);
  }

  /**
   * Render editable card for custom URLs
   */
  _renderCardEditable() {
    this.wrapper.innerHTML = '';
    this.wrapper.style.cssText = `
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
    `;

    const form = document.createElement('div');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

    // Path input
    const pathInput = this._createInput('Path', this.data.path, (val) => { this.data.path = val; });
    // Title input
    const titleInput = this._createInput('Title', this.data.title, (val) => { this.data.title = val; });
    // Description input
    const descInput = this._createInput('Description', this.data.description, (val) => { this.data.description = val; });

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
    doneBtn.addEventListener('click', () => this._renderCard());

    form.appendChild(pathInput);
    form.appendChild(titleInput);
    form.appendChild(descInput);
    form.appendChild(doneBtn);

    this.wrapper.appendChild(form);
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
    input.value = value;
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
   * Extract data from the block
   */
  save() {
    return {
      path: this.data.path,
      title: this.data.title,
      description: this.data.description,
      icon: this.data.icon,
    };
  }

  /**
   * Validate block data
   */
  validate(savedData) {
    return savedData.path && savedData.title;
  }
}
