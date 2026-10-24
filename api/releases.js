const OWNER = "kriswu-dev";
const REPO = "craft-station-site";

module.exports = async function handler(_req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const releases = (await response.json()).filter(release => !release.draft);
    const totalDownloads = releases.reduce((sum, release) =>
      sum + (release.assets || []).reduce((assetSum, asset) =>
        assetSum + (/Craft-Station-Setup\.exe$/i.test(asset.name) ? asset.download_count : 0), 0), 0);
    const latest = releases.find(release => !release.prerelease) || releases[0] || null;
    res.status(200).json({
      latest: latest && {
        name: latest.name,
        tag_name: latest.tag_name,
        body: latest.body,
        published_at: latest.published_at,
        html_url: latest.html_url,
        assets: (latest.assets || []).map(asset => ({
          name: asset.name,
          size: asset.size,
          download_count: asset.download_count,
          browser_download_url: asset.browser_download_url
        }))
      },
      totalDownloads
    });
  } catch (_error) {
    res.status(502).json({ error: "release_feed_unavailable" });
  }
};
