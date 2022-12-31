@youtube
Feature: Getting give away winner
	A winner must be chosen on a video using a keyword

  Scenario: Give away winner is requested successfully
    Given user needs info about a giveaway for a certain video
    Given user has correct JWT token
    Given videoId is "<videoId>"
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with code <code> and description "<description>"

    Examples: 
      | videoId           | giveAwayCode | code | description                           |
      | okINSj2Okxwxxxxxx | wooow        |  500 | Check the video ID as it is incorrect |
