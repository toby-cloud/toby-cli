# toby-cli
> A command line interface to help manage and interact with your Toby bots.

##### Installation
```bash
git clone https://github.com/toby-cloud/toby-cli.git
cd toby-cli
npm install
```

## Usage:

#### Signup:

`node index.js signup <username> <password>`

Create a new Toby user bot.

#### Configure:

`node index.js config <botname> <password>`

Configure app to use given credentials for future interactions.


#### Send:

`node index.js send '<message>'`

Send a message from configured bot. The application will extract any tags and properly form the message for publishing.

#### Follow:

`node index.js follow '<hashtag_string>'`

Add subscriptions for configured bot. The hashtag string should be in the following format: '#tag1 #tag2 #tag3'.


#### Unfollow:

`node index.js unfollow '<hashtag_string>'`

Remove subscriptions for configured bot. The hashtag string should be in the following format: '#tag1 #tag2 #tag3'.

#### Info:

`node index.js info`

Get information for the configured bot.
