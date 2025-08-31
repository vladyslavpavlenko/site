/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://me.x70.one",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/login"],
      },
    ],
  },
};
