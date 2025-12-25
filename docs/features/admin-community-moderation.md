# Admin Community Moderation Guide

## Overview
The Admin Community Reports page provides tools for moderating community content (forum topics and replies) based on user reports. Admins can review reports, dismiss false reports, hide inappropriate content, and suspend problematic users.

## Accessing the Interface
Navigate to: `/admin/community/reports`

## Dashboard Statistics

The top of the page displays 5 stat cards:
- **Total:** All reports in the system
- **Pending:** Reports awaiting admin review (shows "Needs review" warning)
- **Reviewed:** Reports reviewed but no action taken
- **Dismissed:** Reports dismissed as invalid
- **Actioned:** Reports where action was taken (content hidden or user suspended)

## Filtering Reports

Use the tabs to filter reports by status:
- **All:** View all reports regardless of status
- **Pending:** Reports that need review (shows badge count)
- **Reviewed:** Reports that have been reviewed
- **Dismissed:** Reports marked as invalid/not actionable
- **Actioned:** Reports where moderation action was taken

## Report Card Information

Each report card displays:
- **Content Type:** Topic or Reply (with icon)
- **Status Badge:** Current status (Pending, Reviewed, Dismissed, Actioned)
- **Reason Badge:** Why it was reported (Spam, Harassment, Inappropriate Content, Other)
- **Content Preview:** First 2 lines of the reported content
- **Author:** Who created the content
- **Reporter:** Who reported it (with avatar)
- **Details:** Reporter's explanation of why they reported it
- **Admin Notes:** (If reviewed) Notes from the admin who reviewed it
- **Timestamp:** When the report was created

## Taking Action on Reports

### 1. Dismiss Report (No Action)
Use this when the report is invalid or doesn't violate community guidelines.

**Steps:**
1. Click the "Dismiss" button on the report card
2. Review the report details in the dialog
3. Optionally add admin notes explaining why (internal only)
4. Click "Dismiss Report"

**Result:** Report status changes to "Dismissed"

### 2. Hide Content
Use this when content violates community guidelines but doesn't warrant user suspension.

**Steps:**
1. Click the "•••" menu on the report card
2. Select "Hide Content"
3. Review the report summary
4. **Required:** Enter a reason explaining why the content is being hidden (sent to user)
5. Click "Hide Content"

**Result:**
- Content is hidden from community
- User receives notification with reason
- Report status changes to "Actioned"

### 3. Suspend User
Use this for serious or repeated violations of community guidelines.

**Steps:**
1. Click the "•••" menu on the report card
2. Select "Suspend User"
3. Review the report summary
4. Select suspension duration:
   - 1 Day
   - 3 Days
   - 7 Days (1 Week)
   - 14 Days (2 Weeks)
   - 30 Days (1 Month)
   - 90 Days (3 Months)
   - Permanent
5. **Required:** Enter reason for suspension (sent to user)
6. Review the warning message
7. Click "Suspend User"

**Result:**
- User is suspended for selected duration
- User cannot access community features
- User receives notification with reason
- Report status changes to "Actioned"

**Warning:** Permanent suspensions cannot be undone. Use with extreme caution.

### 4. View Report Details
Click the "View Details" option to see full report information without taking action.

## Bulk Actions

When multiple reports need the same action (e.g., dismissing multiple invalid reports):

### Selecting Reports
1. Click the checkbox next to individual reports, OR
2. Click the checkbox in the bulk actions header to select all visible reports

### Bulk Actions Available
- **Dismiss All:** Dismiss all selected reports at once
- **Clear Selection:** Deselect all reports

### Using Bulk Actions
1. Select one or more reports using checkboxes
2. Bulk actions bar appears showing selection count
3. Click "Dismiss All" to dismiss all selected reports
4. Reports are processed and selection is cleared

**Note:** Currently only bulk dismiss is supported. For hide/suspend actions, handle reports individually to ensure proper reasoning.

## Best Practices

### Review Thoroughly
- Read the full content preview
- Check the reporter's explanation
- Consider the content author's history if available
- Don't rush decisions

### Provide Clear Reasons
- When hiding content or suspending users, always explain why
- Be professional and specific
- The user will see your reason, so be respectful
- Reference specific community guidelines when possible

### Graduated Responses
1. **First offense (minor):** Dismiss with warning (if system supports user warnings)
2. **First offense (moderate):** Hide content
3. **Repeated offenses:** Short suspension (1-7 days)
4. **Serious violations:** Longer suspension (14-90 days)
5. **Egregious violations:** Permanent suspension

### Examples by Report Reason

#### Spam
- **Valid:** Links to external services, repeated promotional content
- **Invalid:** Legitimate mentions of resources, helpful links
- **Action:** Usually hide content, suspend if repeated

#### Harassment
- **Valid:** Personal attacks, discriminatory comments, threatening language
- **Invalid:** Disagreements, debate, criticism of ideas (not people)
- **Action:** Hide content + suspend (1-30 days depending on severity)

#### Inappropriate Content
- **Valid:** Sexual content, graphic violence, academic dishonesty promotion
- **Invalid:** Mild language, unpopular opinions
- **Action:** Hide content, suspend if serious

#### Other
- Review case-by-case as these are often edge cases or unclear violations

### False Reports
Some users may abuse the report system. If you notice patterns of false reporting:
1. Dismiss the reports
2. Make note of the reporter in admin notes
3. If repeated, consider warning the reporter about system abuse

## Notifications

When you take action:
- **Dismiss:** No notification sent (internal only)
- **Hide Content:** User receives notification that their content was hidden with your reason
- **Suspend User:** User receives notification that they are suspended with duration and reason

## Keyboard Shortcuts

Currently not implemented, but planned:
- `D` - Dismiss selected report
- `H` - Hide content
- `S` - Suspend user
- `Esc` - Close dialog

## Mobile Access

The interface is responsive and works on mobile devices, but for detailed moderation work, desktop is recommended for easier review of multiple reports.

## Common Scenarios

### Scenario 1: Trolling
**Report:** User posting "CRNA programs are a joke. The whole profession is dying."
**Action:** Hide content + Suspend user (7-30 days)
**Reason:** "Trolling and discouraging community members violates our guidelines. Please refrain from posting inflammatory content designed to upset others."

### Scenario 2: Academic Dishonesty
**Report:** User promoting paid essay writing services
**Action:** Hide content + Suspend user (14-30 days)
**Reason:** "Promoting services that violate academic integrity is not allowed. All members are expected to maintain ethical standards in their CRNA school applications."

### Scenario 3: Spam
**Report:** User repeatedly posting YouTube channel links
**Action:** Hide content + Warn or brief suspension
**Reason:** "Repeated self-promotion without adding value to discussions is considered spam. Please focus on contributing to the community conversation."

### Scenario 4: Disagreement Reported as Harassment
**Report:** "User disagreed with my study method"
**Content:** "I disagree with your approach. I think flashcards work better than concept mapping."
**Action:** Dismiss
**Reason:** "This is a normal disagreement about study methods, not harassment. Users are allowed to respectfully disagree."

### Scenario 5: Sexist/Discriminatory Content
**Report:** "Women shouldn't be in CRNA programs. They just get pregnant and quit."
**Action:** Hide content + Permanent suspension
**Reason:** "Discriminatory and sexist comments have no place in our community. This is a permanent ban due to the serious nature of this violation."

## Escalation

For difficult cases:
1. Document the situation in admin notes
2. Discuss with other admins if available
3. When in doubt, err on the side of dismissing (can always revisit if more reports come in)
4. For threats of violence or illegal activity, consider involving legal/authorities

## Privacy & Legal

- All admin notes are internal only
- Reasons for hiding/suspending are sent to users
- Keep records of all moderation actions
- Follow applicable laws regarding user data and content moderation
- Do not share user reports publicly

## Future Enhancements

Planned features:
- Auto-hide after X reports threshold
- User warning system (before suspension)
- Appeal process for suspended users
- Moderation activity log
- Report history per user
- Restore hidden content option
- Search and filter reports

---

**Questions?** Contact the development team for technical issues or other admins for policy questions.
