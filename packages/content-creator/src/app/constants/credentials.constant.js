export default class CredentialsConstant {
  getCredentials() {
    let cachedCredentials = localStorage.getItem("cachedCredentials");
    if (cachedCredentials) {
      try {
        cachedCredentials = JSON.parse(cachedCredentials);
      } catch (e) {}
      return cachedCredentials;
    }
  }
}
