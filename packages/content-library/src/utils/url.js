export function buildCreatorUrl(content, user) {
  window.parent.contentEditorRecord = { data: content };
  window.localStorage.setItem('loggedInUser', JSON.stringify(user));

  const editorRoles = ['Editor', 'Contributor'];
  const { community, roles } = user;
  const editorRole = roles.filter((role) => editorRoles.includes(role))[0];

  const params = new URLSearchParams({
    editorRole,
    user: user._id,
    communityId: community._id,
    communityName: community.name,
    documentId: content._id,
    type: content.originalDocumentType,
    documentName: content.name,
    orientation: content.originalDocumentOrientation,
    template: content.template,
  });

  return `/creator?${params.toString()}`;
}
