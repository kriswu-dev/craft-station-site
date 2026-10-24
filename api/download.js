const OWNER = "kriswu-dev";
const REPO = "craft-station-site";
const INSTALLER = "Craft-Station-Setup.exe";
const FALLBACK_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/downloads/${INSTALLER}`;

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end("Method Not Allowed");
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }
    });
    if (response.ok) {
      const releases = (await response.json()).filter(release => !release.draft);
      const latest = releases.find(release => !release.prerelease) || releases[0];
      const asset = latest && (latest.assets || []).find(item => item.name.toLowerCase() === INSTALLER.toLowerCase());
      if (asset) {
        res.setHeader("Cache-Control", "no-store");
        return res.redirect(302, asset.browser_download_url);
      }
    }
  } catch (_error) {
    // Keep downloads available if GitHub's release API is temporarily unavailable.
  }
  res.setHeader("Cache-Control", "no-store");
  return res.redirect(302, FALLBACK_URL);
};
