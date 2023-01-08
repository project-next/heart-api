@youtube
Feature: Calling giveaway endpoint with missing required fields.

  Scenario: User requests giveaway info but they are missing the videoId query param.
    Given user needs info about a giveaway for a certain video
    Given user has correct JWT token
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with code <code> and description "<description>"

    Examples: 
      | giveAwayCode | code | description                   |
      | wooow        |  400 | Missing required query params |

  Scenario: User requests giveaway info but they are missing the giveAwayCode query param.
    Given user needs info about a giveaway for a certain video
    Given user has correct JWT token
    Given videoId is "<videoId>"
    When user calls API
    Then API should return with code <code> and description "<description>"

    Examples: 
      | videoId     | code | description                   |
      | okINSj2Okxw |  400 | Missing required query params |

  Scenario: User requests giveaway info but they use a malformed JWT key.
    Given user needs info about a giveaway for a certain video
    Given user has malformed JWT token
    Given videoId is "<videoId>"
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with code <code> and description "<description>"

    Examples: 
      | videoId     | code | description   |
      | okINSj2Okxw |  401 | jwt malformed |

  Scenario: User requests giveaway info but they are missing the JWT key.
    Given user needs info about a giveaway for a certain video
    Given user doesn't use a JWT key
    Given videoId is "<videoId>"
    Given giveAwayCode is "<giveAwayCode>"
    When user calls API
    Then API should return with code <code> and description "<description>"

    Examples: 
      | videoId     | code | description          |
      | okINSj2Okxw |  401 | jwt must be provided |
