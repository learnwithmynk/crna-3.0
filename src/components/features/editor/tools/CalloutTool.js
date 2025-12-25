/**
 * CalloutTool - Custom Editor.js Block
 *
 * Creates callout blocks with different types: tip, warning, note, important.
 * Each type has its own icon and colored background.
 */

// Use inline SVG icons since @codexteam/icons has limited selection

/**
 * Simple SVG icons for callout types
 */
const ICONS = {
  tip: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  important: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
};

/**
 * Callout block types with their styling
 */
const CALLOUT_TYPES = {
  tip: {
    label: 'Tip',
    icon: ICONS.tip,
    bgColor: '#ecfdf5',
    borderColor: '#10b981',
    textColor: '#065f46',
  },
  warning: {
    label: 'Warning',
    icon: ICONS.warning,
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
    textColor: '#92400e',
  },
  note: {
    label: 'Note',
    icon: ICONS.note,
    bgColor: '#eff6ff',
    borderColor: '#3b82f6',
    textColor: '#1e40af',
  },
  important: {
    label: 'Important',
    icon: ICONS.important,
    bgColor: '#fef2f2',
    borderColor: '#ef4444',
    textColor: '#991b1b',
  },
};

export default class CalloutTool {
  /**
   * Editor.js API
   */
  static get toolbox() {
    return {
      title: 'Callout',
      icon: ICONS.note,
    };
  }

  /**
   * Allow Callout to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: (data) => data.text,
      import: (text) => ({ text, type: 'note' }),
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
        b: true,
        i: true,
        a: { href: true },
      },
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
      type: data.type || 'note',
      text: data.text || '',
      title: data.title || '',
    };

    this.wrapper = null;
    this.textInput = null;
    this.titleInput = null;
  }

  /**
   * Render the block in the editor
   */
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('callout-block');
    this._applyStyles();

    // Type selector
    const typeSelector = this._createTypeSelector();

    // Title input
    this.titleInput = document.createElement('div');
    this.titleInput.classList.add('callout-title');
    this.titleInput.contentEditable = true;
    this.titleInput.dataset.placeholder = 'Title (optional)';
    this.titleInput.innerHTML = this.data.title;
    this.titleInput.style.cssText = `
      font-weight: 600;
      margin-bottom: 4px;
      outline: none;
      min-height: 1.2em;
    `;

    // Text input
    this.textInput = document.createElement('div');
    this.textInput.classList.add('callout-text');
    this.textInput.contentEditable = true;
    this.textInput.dataset.placeholder = 'Enter callout text...';
    this.textInput.innerHTML = this.data.text;
    this.textInput.style.cssText = `
      outline: none;
      min-height: 1.5em;
    `;

    // Content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = 'flex: 1; min-width: 0;';
    contentWrapper.appendChild(this.titleInput);
    contentWrapper.appendChild(this.textInput);

    // Icon
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('callout-icon');
    iconWrapper.innerHTML = CALLOUT_TYPES[this.data.type].icon;
    iconWrapper.style.cssText = `
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-right: 12px;
    `;

    // Main content row
    const contentRow = document.createElement('div');
    contentRow.style.cssText = 'display: flex; align-items: flex-start;';
    contentRow.appendChild(iconWrapper);
    contentRow.appendChild(contentWrapper);

    this.wrapper.appendChild(typeSelector);
    this.wrapper.appendChild(contentRow);

    return this.wrapper;
  }

  /**
   * Create type selector buttons
   */
  _createTypeSelector() {
    const selector = document.createElement('div');
    selector.style.cssText = `
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    `;

    Object.entries(CALLOUT_TYPES).forEach(([type, config]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = config.label;
      button.style.cssText = `
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid ${type === this.data.type ? config.borderColor : '#e5e7eb'};
        background: ${type === this.data.type ? config.bgColor : 'white'};
        color: ${type === this.data.type ? config.textColor : '#6b7280'};
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s;
      `;

      button.addEventListener('click', () => {
        this.data.type = type;
        this._applyStyles();
        // Re-render selector to update active state
        selector.replaceWith(this._createTypeSelector());
        // Update icon
        const iconWrapper = this.wrapper.querySelector('.callout-icon');
        if (iconWrapper) {
          iconWrapper.innerHTML = CALLOUT_TYPES[type].icon;
        }
      });

      selector.appendChild(button);
    });

    return selector;
  }

  /**
   * Apply styles based on current type
   */
  _applyStyles() {
    const config = CALLOUT_TYPES[this.data.type];
    this.wrapper.style.cssText = `
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid ${config.borderColor};
      background: ${config.bgColor};
      color: ${config.textColor};
    `;
  }

  /**
   * Extract data from the block
   */
  save() {
    return {
      type: this.data.type,
      title: this.titleInput?.innerHTML || '',
      text: this.textInput?.innerHTML || '',
    };
  }

  /**
   * Validate block data
   */
  validate(savedData) {
    return savedData.text.trim() !== '';
  }
}
