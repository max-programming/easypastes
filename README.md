<p align='center'>
  <a href="https://easypastes.tk">
    <img src="https://easypastes.tk/logo.png" height="128">
    <h1 align="center">Easy Pastes</h1>
  </a>
</p>

<h3 align="center">An intuitive, amazing, feature rich and easy to use Code paste service!</h3>

<p align="center">
  <a href="https://choosealicense.com/licenses/mit/">
    <img src="https://img.shields.io/apm/l/atomic-design-ui.svg?" alt="License" />
  </a>
</p>

#### ✨ The live [Instance](https://easypastes.tk)

#### Here's a sneak peak to the app - [Link to the GIF](https://cdn.hashnode.com/res/hashnode/image/upload/v1627542797932/0TNW01u9N.gif)


## Tech Stack

- [Next.js](https://nextjs.org/)
- [Chakra UI](http://chakra-ui.com/)
- [Supabase](http://supabase.io/)
- [Clerk](https://clerk.dev)

### Development or Contributing

If you're interested in growing this project further,
Add a `.env.local` file based on `.env.example` file. And add the following things:

- Get your supabase instance info from [here](https://supabase.io).
- Make a new Clerk App and get the info for it from [here](https://clerk.dev).

## Installation and Running

Here is a quick and easy guide for you to run EasyPastes for development, or self hosting it 
for yourself.

### 🐳 With Docker

Docker is an easy way of containerizing and delivering your applications quickly and easily, 
in a convenient way. It's really simple to get started with this, with docker handling all the 
installation and other tasks.

Configure the environmental variables by renaming the `.env.example` file to `.env.local` with 
the respective values. Once you have your environmental variables and config, follow the guide below.

Docker mini guide:

- To start development environment: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
- To start production deployment: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up`
- To stop the container: `docker-compose down`
- To rebuild the container: `docker-compose --build`

Both development and production almost run same thing, With some different tweaks and changes. 
Both of run on `127.0.0.1:3000`. For displaying it in production, Use Nginx or Apache to proxy it.


### Without Docker

This is another way to host, but without docker. You can follow this if docker doesn't work
well on your system, or it doesn't support it. Containers are resource intensive, and your PC might not
be able to do it, this is the perfect method to get started with the self-hosting.

Here are the steps to configure and run the app:

- Configure Supabase for Database.
  - Check the [official docs](https://supabase.io/docs/guides/with-nextjs) for help with setup.
- Configure Clerk for Authentication services.
  - Check this [article](https://medium.com/geekculture/mastering-clerk-authentication-with-the-next-js-standard-setup-c66b97bac724) out for configuration of clerk.
- Configuring Environmental variables based on Supabase and Clerk setup.
- Finally run the app!

#### Environment Variables

To run this project, you will need to properly configure environmental variables. Configure the 
environmental variables by renaming the `.env.example` file to `.env.local` with the respective values.

#### Run the app!

Install the dependencies first.

```sh
yarn
# OR
npm install
```

Then, Finally, Start the server!

```sh
yarn dev
# OR
npm run dev
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome. After cloning & setting up project locally, 
you can just submit a PR to this repo and it will be deployed once it's accepted.

⚠️ It’s good to have descriptive commit messages, or PR titles so that other contributors can understand about your
commit or the PR Created. Read [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) before
making the commit message.

## 💬 Get in touch

If you have various suggestions, questions or want to discuss things with our community, Have a look at
[Github discussions](https://github.com/max-programming/easypastes/discussions) or Reach us out at Twitter!

## 🙌 Show your support

We love and appreciate people's support in growing and improving. Be sure to leave a ⭐️ if you like the project and also be sure to contribute, if you're interested!

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [Sunrit Jana](https://github.com/janaSunrise)
- [Usman](https://github.com/max-programming)

<div align="center">Made by the EasyPastes team with ♥</div>
