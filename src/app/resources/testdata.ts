import {ITrainingPlan, TrainingDay, TrainingPlan} from './models/training-plan';
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

const workoutDips: IWorkout = {
    id: 4,
    type: EWorkoutType.Dips,
    name: "Dips",
    repetitions: 10,
    sets: 4,
    weight: 3,
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

export const testPlan: ITrainingPlan = new TrainingPlan("Test Plan", [
    new TrainingDay("Test Tag 1", [workoutBankDruecken, workoutButterfly]),
    new TrainingDay("Test Tag 2", [workoutTrizeps, workoutButterfly]),
    new TrainingDay("Test Tag 3", [workoutBankDruecken, workoutDips]),
    new TrainingDay("Test Tag 4", [workoutButterfly, workoutTrizeps]),
]);

export class TestData {
    public static plan: ITrainingPlan = testPlan;
    public static history: IWorkoutHistoryItem[] = testHistory;
    public static workouts: IWorkout[] = [
        workoutButterfly,
        workoutTrizeps,
        workoutBankDruecken,
        workoutDips
    ];
}


