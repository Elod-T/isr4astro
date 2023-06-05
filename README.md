# What's isr4astro?
Isr4astro add's [incremental static regeneration](https://jamstackexpert.com/posts/incremental-static-regeneration) capabilities to AstroJS! Just like in NextJS where you may know this feature from.

# Why use ISR?
Look at this example: you have a static website with 10s of thousands of pages. You change the content on one of your pages and the whole website needs to be rebuilt. This takes resources and time away from you. By using ISR you only rebuild the pages that you need, reducing build times exponentially increasing with the number of pages you have.

# How does isr4astro work?
If you look at the repo you will find a custom build of astro with a modified build tool. This allows us to build **only one** path (eg: `/blog/first-post`) independently from the others. The server is using this to build pages when needed.

# How to use?
1. Install `@isr4astro/core` with your favorite package manager
```sh
npm i @isr4astro/core
yarn add @isr4astro/core
pnpm i @isr4astro/core
```
2. Create an entry in your `package.json` file for starting the isr server. Note: before the first start make sure to build your whole site
```json
{
  "scripts": {
    "start-isr": "node node_modules/@isr4astro/core/dist/index.js"
  }
}
```
3. Run your server
```sh
yarn start-isr
```

# Disclaimer
- The project is in an early state, and for the time being is more of a proof-of-concept
- So it's NOT production ready
- PRs of any kind appreciated
