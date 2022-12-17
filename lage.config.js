module.exports = {
    pipeline: {
      build: ["^build"],
      test: ["build"],
      start: ["build"],
    },
  };