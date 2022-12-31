@youtube
Feature: Getting give away winner - service level error occurred

  Scenario: Give away winner not returned correctly as the video ID is invalid or a vidoe with that ID does not exist on YouTube
    Given user needs info about a giveaway for a certain video
    Given user has correct JWT token
    Given videoId is "<videoId>"
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with code <code> and description "<description>"

    Examples: 
      | videoId           | giveAwayCode | code | description                           |
      | okINSj2Okxwxxxxxx | wooow        |  500 | Check the video ID as it is incorrect |
