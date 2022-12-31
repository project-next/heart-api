@youtube
Feature: Getting give away winner
	A winner must be chosen on a video using a keyword

  Scenario: Give away winner is requested successfully
    Given user needs info about a giveaway for a certain video
    Given user has correct JWT token
    Given videoId is "<videoId>"
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with success and the body of response should contain winner info. Response should have <entries> total entries

    Examples: 
      | videoId     | giveAwayCode | entries |
      | okINSj2Okxw | wooow        |       1 |
