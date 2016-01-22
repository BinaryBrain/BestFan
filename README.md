# Best Fan

Best Fan is a web service showing you who is your best fan on GitHub, according to who gave you stars.

[Try it know!](http://binarybrain.github.io/BestFan/)

## Introduction

This work has been done as a homework for the HEIG-VD.

The purpose of this project is to learn how to use the GitHub API and create a cool data viz app with it.

## Github API

I'm using the GitHub API to access users' repositories, and than, to know who has starred a given user's repo.

To acess a given user list of repos, we can just call: `https://api.github.com/users/:username/repos`.

It give us a huge array of object representing repos. Each repo contains:

```js
	{
		"stargazers_url": "https://api.github.com/repos/BinaryBrain/ant/stargazers",
		"stargazers_count": 4,
		// More stuff
	}
```

If we than call the given URL (`stargazers_url`), we obtain a list of user in this form:

```js
{
	"login": "BinaryBrain",
	"id": 1102077,
	"avatar_url": "https://avatars.githubusercontent.com/u/1102077?v=3",
	"url": "https://api.github.com/users/BinaryBrain",
	"html_url": "https://github.com/BinaryBrain",
	// More stuff
  }
```

## Handling data

Once we obtained the list of repos for the given users, we can seek for stargazers for each repositories.
That mean we will call the `stargazers_url` as many time as we have repos, obviously in parallel, and put every stargazers in a big array.

We will then just count how many time we have a user in our array and that will gives us how a user like our work.

We then just have to sort every thing to make a nice ranking.

## AngularJS

I tried to use AngularJS as much as I could (without overdoing it) because it was also a part of the homework.

I just have one controller with an input that passes its content from the view to the model using the `ng-model="username"` attribute.

To display data, I use the `ng-repeat="fan in fans"` attribute to loop over every stargazers and display their data.

To generate the graph at the top of the window, I use the `ng-style` attribute so I can use data from the scope to generate the graph as I want.

## Conclusion

I pretty happy to see that works pretty well and it's always fun to see who like what you are doing.  
I did discover that a user I didn't know has starred one of my repo and I went to his GitHub profile to see what he does. Turns out he's a pretty interesting coder!

This project may enhance the social aspect of GitHub, which I particularly like.
