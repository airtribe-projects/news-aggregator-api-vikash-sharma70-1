const mockNewsApi = {
  get: async (url, { params } = {}) => {

    if (url.includes("top-headlines")) {
      return {
        data: {
          totalResults: 1,
          articles: [
            {
              title: "Mock Headline",
              description: "Mock description",
              url: "https://example.com/news",
              source: { name: "MockSource" },
              publishedAt: new Date().toISOString(),
            },
          ],
        },
      }
    }

    if (url.includes("everything")) {
      return {
        data: {
          totalResults: 1,
          articles: [
            {
              title: "Mock Article",
              description: "Mock description",
              url: "https://example.com/article",
              source: { name: "MockSource" },
              publishedAt: new Date().toISOString(),
            },
          ],
        },
      }
    }

    return {
      data: {
        totalResults: 0,
        articles: [],
      },
    }
  },
}

module.exports = mockNewsApi