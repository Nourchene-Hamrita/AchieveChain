pragma solidity ^0.8.9;

contract Moodle {
    event AddCourse(address recipient, uint courseId);
    event AddBadge(address recipient, uint badgeId);
    event AddCompetency(address recipient, uint competencyId);
    event SetFinished(uint courseId, bool finished);
    event DeleteBadge(uint badgeId, bool isDeleted);
    event DeleteCompetency(uint competencyId, bool isDeleted);

    struct Course {
        uint id;
        string name;
        uint year;
        string description;
        bool finished;
    }
    struct Badge {
        uint id;
        string name;
        string description;
        string issuername;
        bool isDeleted;
    }
    struct Competency {
        uint id;
        string name;
        string gradename;
        string createdAt;
        bool isDeleted;
    }
    Course[] private courseList;
    Badge[] private badgeList;
    Competency[] private competencyList;
    // Mapping of course id to the wallet address of the user adding the new course under their name
    mapping(uint256 => address) courseToOwner;
    // Mapping of badge id to the wallet address of the user adding the new Badge under their name
    mapping(uint256 => address) badgeToOwner;
    // Mapping of competency id to the wallet address of the user adding the new Competency under their name
    mapping(uint256 => address) competencyToOwner;

    function addCourse(
        string memory name,
        uint16 year,
        string memory description,
        bool finished
    ) external {
        uint courseId = courseList.length;
        courseList.push(Course(courseId, name, year, description, finished));
        courseToOwner[courseId] = msg.sender;
        emit AddCourse(msg.sender, courseId);
    }

    function addBadge(
        string memory name,
        string memory issuername,
        string memory description,
        bool isDeleted
    ) external {
        uint badgeId = badgeList.length;
        badgeList.push(Badge(badgeId, name, issuername, description, isDeleted ));
        badgeToOwner[badgeId] = msg.sender;
        emit AddBadge(msg.sender, badgeId);
    }

    function addCompetency(
        string memory name,
        string memory gradename,
        string memory createdAt,
        bool isDeleted
    ) external {
        uint competencyId = competencyList.length;
        competencyList.push(
            Competency(competencyId, name, gradename, createdAt,isDeleted)
        );
        competencyToOwner[competencyId] = msg.sender;
        emit AddCompetency(msg.sender, competencyId);
    }

    function _getCourseList(
        bool finished
    ) private view returns (Course[] memory) {
        Course[] memory temporary = new Course[](courseList.length);
        uint counter = 0;
        for (uint i = 0; i < courseList.length; i++) {
            if (
                courseToOwner[i] == msg.sender &&
                courseList[i].finished == finished
            ) {
                temporary[counter] = courseList[i];
                counter++;
            }
        }
        Course[] memory result = new Course[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function getFinishedCourses() external view returns (Course[] memory) {
        return _getCourseList(true);
    }

    function getUnfinishedCourses() external view returns (Course[] memory) {
        return _getCourseList(false);
    }

    function setFinished(uint courseId, bool finished) external {
        if (courseToOwner[courseId] == msg.sender) {
            courseList[courseId].finished = finished;
            emit SetFinished(courseId, finished);
        }
    }

    function _getBadgeList() external view returns (Badge[] memory) {
        Badge[] memory temporary = new Badge[](badgeList.length);
        uint counter = 0;
        for (uint i = 0; i < badgeList.length; i++) {
            if (badgeToOwner[i] == msg.sender) {
                temporary[counter] = badgeList[i];
                counter++;
            }
        }
        Badge[] memory result = new Badge[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function _getCompetencyList() external view returns (Competency[] memory) {
        Competency[] memory temporary = new Competency[](competencyList.length);
        uint counter = 0;
        for (uint i = 0; i < competencyList.length; i++) {
            if (competencyToOwner[i] == msg.sender) {
                temporary[counter] = competencyList[i];
                counter++;
            }
        }
        Competency[] memory result = new Competency[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }
     function deleteBadge(uint badgeId, bool isDeleted) external {
        if(badgeToOwner[badgeId] == msg.sender) {
            badgeList[badgeId].isDeleted = isDeleted;
            emit DeleteBadge(badgeId, isDeleted);
        }
        }
        function deleteCompetency(uint competencyId, bool isDeleted) external {
        if(competencyToOwner[competencyId] == msg.sender) {
            competencyList[competencyId].isDeleted = isDeleted;
            emit DeleteCompetency(competencyId, isDeleted);
        }
    }
}

