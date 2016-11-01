#!/usr/bin/env node

var shell = require('commander');
var request = require('request');
var toby = require('toby')
var config = require('./lib/config.js');
var randomID = require('random-id');

var findHashtags = require('./lib/hashtag.js').findHashtags;
var removeHashtags = require('./lib/hashtag.js').removeHashtags;

shell.version('0.0.1');

shell
  .command('signup <username> <password>')
  .description('create a new user bot')
  .action(function(username, password) {
    console.log(username + " wants to sign up");
    request({
      url: "http://toby.cloud/signup",
      method: "POST",
      form: {
        username: username,
        password: password
      }
    }, function(err,res,body) {
      if (err || res.statusCode != 200) {
        console.log("error creating user bot", res.statusCode);
      } else {
        console.log(body);
      }
    });
  });

shell
  .command('config <username> <password>')
  .description('set bot credentials')
  .action(function(username, password) {
    config.setConfig(username, password, function(err,res) {
      if (err) return console.log(err);
      console.log("credentials set", username, password);
    });
  });

shell
  .command('send <message>')
  .description('send bot message (users, bots, and sockets)')
  .action(function(message) {
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        var tags = findHashtags(message);
        var tagless_message = removeHashtags(message);
        bot.send({
          message: tagless_message,
          messageType: "TEXT",
          tags: tags
        });
        }, function(from, message) {
          console.log("message sent");
          process.exit(1);
        });
      bot.start();
    })
  });

shell
  .command('follow <tags>')
  .description('set bot subscriptions (bots only)')
  .action(function(tag_string) {
    var randomAckTag = randomID(10, "aA0");
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        var tags = findHashtags(tag_string);
        bot.follow(tags, randomAckTag);
      }, function(from, message) {
        if (message.tags && message.tags[0] == randomAckTag) {
          console.log(from, message.message);
          process.exit(1);
        }
      });
      bot.start();
    });
  });

shell
  .command('unfollow <tags>')
  .description('set bot subscriptions (bots only)')
  .action(function(tag_string) {
    var randomAckTag = randomID(10, "aA0");
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        var tags = findHashtags(tag_string);
        bot.unfollow(tags, randomAckTag);
      }, function(from, message) {
        if (message.tags && message.tags[0] == randomAckTag) {
          console.log(from, message.message);
          process.exit(1);
        }
      });
      bot.start();
    });
  });

shell
  .command('listen <timeout>')
  .description('listen for messages (users, bots, and sockets)')
  .action(function(timeout){
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        console.log("listening");
        setTimeout(function() {
          process.exit(1);
        }, timeout);
      }, function(from, message) {
          console.log(from, message);
      });
      bot.start();
    });
  });

shell
  .command('info <ackTag>')
  .description('get a bot\'s information')
  .action(function(ackTag) {
    console.log("requesting information");
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
          bot.info(ackTag);
      }, function(from, message) {
        console.log(from, message);
        if (message.tags && message.tags[0] == ackTag) {
          console.log(from, JSON.stringify(message.message));
          process.exit(1);
        }
      });
      bot.start();
    });
  });

shell
  .command('bots <ackTag>')
  .description('list the user\'s bots (users only)')
  .action(function(ackTag) {
    console.log("user wants to list bots");
    var randomAckTag = randomID(10, "aA0");
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
          bot.getBots(ackTag);
      }, function(from, message) {
        console.log(from, message);
        if (message.tags && message.tags[0] == ackTag) {
          console.log(from, message.message);
          process.exit(1);
        }
      });
      bot.start();
    });
  });

shell
  .command('sockets')
  .description('list the bot\'s sockets (bots only)')
  .action(function() {
    console.log("bot wants to list sockets");
  });


// THIS WORKS
shell
  .command('subscriptions')
  .description('list the bot\'s subscriptions (bots only)')
  .action(function() {
    var randomAckTag = randomID(10, "aA0");
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        bot.subscriptions(randomAckTag);
      }, function(from, message) {
        if (message.tags && message.tags[0] == randomAckTag) {
          console.log(from, message.message);
          process.exit(1);
        }
      });
      bot.start();
    });
  });

shell
  .command('create-bot <username> <password>')
  .description('create a new bot (users only)')
  .action(function(username, password) {
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        bot.createBot(username, password, function() {
          console.log("created bot");
          process.exit(1);
        });
      });
      bot.start();
    });
  });

shell
  .command('create-socket <persist> <ackTag>')
  .description('create a new socket (bots only)')
  .action(function(persist, ackTag) {
    if (persist == "true") persist = true;
    else                   persist = false;

    console.log("trying to create socket");
    var randomAckTag = randomID(10, "aA0");
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        bot.createSocket(persist, ackTag, function() {
          console.log("created socket");
        });
      }, function(from, message) {
        if (message.tags[0] == ackTag) {
          console.log(from, message.message);
          process.exit(1);
        } else {
          console.log(from, message);
        }
      });
      bot.start();
    });
  });

shell
  .command('remove-bot <id>')
  .description('remove a bot (users only)')
  .action(function(id) {
    console.log("user wants to remove bot", id);
  });

shell
  .command('remove-socket <id>')
  .description('remove a socket (bots only)')
  .action(function(id) {
    console.log("bot wants to remove socket", id);
  });

shell
  .command('hooks-on <password>')
  .description('turn bot hooks on (bots only)')
  .action(function(password) {
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        bot.hooksOn(password);
        console.log("hooks on")
        process.exit(1);
      });
      bot.start();
    });
  });

shell
  .command("hooks-off")
  .description('turn bot hooks off (bots only)')
  .action(function() {
    config.loadConfig(function(err,res) {
      if (err || !res) return console.log("could not load configuration");
      var bot = new toby.Bot(res.username, res.password, function() {
        bot.hooksOff();
        console.log("hooks off")
        process.exit(1);
      });
      bot.start();
    });
  });

shell.parse(process.argv);
