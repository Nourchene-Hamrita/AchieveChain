const { expect } = require("chai");
const { ethers } = require("hardhat");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


describe("Moodle Contract", function () {
    let Moodle;
    let moodle;
    let owner;

    const NUM_UNFINISHED_COURSE = 5;
    const NUM_FINISHED_COURSE = 3;

    let unfinishedCourseList;
    let finishedCourseList;

    function verifyCourse(courseChain, course) {
        expect(course.name).to.equal(courseChain.name);
        expect(course.year.toString()).to.equal(courseChain.year.toString());
        expect(course.description).to.equal(courseChain.description);
    }

    function verifyCourseList(coursesFromChain, courseList) {
        expect(coursesFromChain.length).to.not.equal(0);
        expect(coursesFromChain.length).to.equal(courseList.length);
        for (let i = 0; i < courseList.length; i++) {
            const courseChain = coursesFromChain[i];
            const course = courseList[i];
            verifyCourse(courseChain, course);
        }
    }

    beforeEach(async function () {
        Moodle = await ethers.getContractFactory("Moodle");
        [owner] = await ethers.getSigners();
        moodle = await Moodle.deploy();

        unfinishedCourseList = [];
        finishedCourseList = [];



        for (let i = 0; i < NUM_UNFINISHED_COURSE; i++) {
            let course = {
                'name': getRandomInt(1, 1000).toString(),
                'year': getRandomInt(1800, 2021),
                'description': getRandomInt(1, 1000).toString(),
                'finished': false
            };

            await moodle.addCourse(course.name, course.year, course.description, course.finished);
            unfinishedCourseList.push(course);
        }

        for (let i = 0; i < NUM_FINISHED_COURSE; i++) {
            let course = {
                'name': getRandomInt(1, 1000).toString(),
                'year': getRandomInt(1800, 2021),
                'description': getRandomInt(1, 1000).toString(),
                'finished': true
            };

            await moodle.addCourse(course.name, course.year, course.description, course.finished);
            finishedCourseList.push(course);
        }
    });

    describe("Add Course", function () {
        it("should emit AddCourse event", async function () {
            let course = {
                'name': getRandomInt(1, 1000).toString(),
                'year': getRandomInt(1800, 2021),
                'description': getRandomInt(1, 1000).toString(),
                'finished': false
            };

            await expect(await moodle.addCourse(course.name, course.year, course.description, course.finished)
            ).to.emit(moodle, 'AddCourse').withArgs(owner.address, NUM_FINISHED_COURSE + NUM_UNFINISHED_COURSE);
        })
    })

    describe("Get Course", function () {
        it("should return the correct unfinished courses", async function () {
            const coursesFromChain = await moodle.getUnfinishedCourses()
            expect(coursesFromChain.length).to.equal(NUM_UNFINISHED_COURSE);
            verifyCourseList(coursesFromChain, unfinishedCourseList);
        })

        it("should return the correct finished courses", async function () {
            const coursesFromChain = await moodle.getFinishedCourses()
            expect(coursesFromChain.length).to.equal(NUM_FINISHED_COURSE);
            verifyCourseList(coursesFromChain, finishedCourseList);
        })
    })

    describe("Set Finished", function () {
        it("Should emit SetFinished event", async function () {
            const COURSE_ID = 0;
            const COURSE_FINISHED = true;

            await expect(
                moodle.setFinished(COURSE_ID, COURSE_FINISHED)
            ).to.emit(
                moodle, 'SetFinished'
            ).withArgs(
                COURSE_ID, COURSE_FINISHED
            )
        })
    })
});