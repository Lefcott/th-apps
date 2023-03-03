/** @format */

export default function getCareSettingsDisplayText(name) {
  switch (name) {
    case 'Independent':
      return 'Independent Living';
    case 'Assisted':
      return 'Assisted Living';
    case 'Memory Care':
      return 'Memory Care';
    case 'Skilled Nursing':
      return 'Skilled Nursing';
    case 'Standard':
      return 'No Care Setting';
    default:
      return name;
  }
}
