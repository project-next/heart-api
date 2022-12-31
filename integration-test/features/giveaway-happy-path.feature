@youtube
Feature: Getting give away winner - successfully

  Scenario: Give away winner is returned successfully
    Given user needs info about a giveaway for a certain video
    Given user has correct JWT token
    Given videoId is "<videoId>"
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with success and the body of response should contain winner info. Response should have <entries> total entries

    Examples: 
      | videoId     | giveAwayCode | entries |
      | okINSj2Okxw | wooow        |       1 |
