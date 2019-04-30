import {ITrainingPlan} from './models/training-plan';
import {EWorkoutType, IWorkout, IWorkoutHistoryItem} from './models/workout';

const workoutBankDruecken: IWorkout = {
    id: 0,
    type: EWorkoutType.BankDruecken,
    name: "Bank Drücken",
    repetitions: 1,
    sets: 1,
    weight: 50,
};

const workoutButterfly: IWorkout = {
    id: 1,
    name: "Butterfly",
    type: EWorkoutType.Butterfly,
    repetitions: 5,
    sets: 4,
    weight: 12,
};

const workoutTrizeps: IWorkout = {
    id: 2,
    name: "Trizeps Curls",
    type: EWorkoutType.TrizepsCurls,
    repetitions: 32,
    sets: 5,
    weight: 7,
};



export const testHistory: IWorkoutHistoryItem[] = [
    {
        date: new Date(Date.parse("01/01/2019")),
        workout: workoutBankDruecken
    },
    {
        date: new Date(Date.parse("02/01/2019")),
        workout: workoutButterfly
    },
    {
        date: new Date(Date.parse("03/01/2019")),
        workout: workoutTrizeps
    },
    {
        date: new Date(Date.parse("01/02/2019")),
        workout: workoutBankDruecken
    },
    {
        date: new Date(Date.parse("02/02/2019")),
        workout: workoutBankDruecken
    },
    {
        date: new Date(Date.parse("02/02/2019")),
        workout: workoutButterfly
    }
];

export const testPlan: ITrainingPlan = {
    id: 0,
    name: "Test Plan",
    days: [
        {
            id: 0,
            name: "Test Tag 1",
            workouts: [
                workoutBankDruecken,
                workoutButterfly,
            ]
        },
        {
            id: 1,
            name: "Test Tag 2",
            workouts: [
                workoutButterfly,
                workoutTrizeps
            ]
        },
        {
            id:2,
            name: "Test Tag 3",
            workouts: [
                workoutBankDruecken,
                workoutTrizeps
            ]
        }
    ]
};

export class TestData {
    public static plan: ITrainingPlan = testPlan;
    public static history: IWorkoutHistoryItem[] = testHistory;
    public static workouts: IWorkout[] = [
        workoutButterfly,
        workoutTrizeps,
        workoutBankDruecken,
    ];
}


