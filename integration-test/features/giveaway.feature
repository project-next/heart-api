@youtube
Feature: Getting give away winner
	A winner must be chosen on a video using a keyword

	Scenario: Give away winner is requested successfully
		Given user pings API for give away winner for video
		When user has request where videoId is "<videoId>", giveAwayCode is "<giveAwayCode>"
		Then API should return with success and the body of response should contain winner info

		Examples:
			| videoId 				| giveAwayCode 	|
			| okINSj2Okxw 			| wooow				|
			| okINSj2Okxw 			| wooow				|