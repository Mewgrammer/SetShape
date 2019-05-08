import {EWorkoutType, ITrainingPlan, IWorkout, IWorkoutHistoryItem} from './models/interfaces';
import {TrainingDay, TrainingPlan, Workout, WorkoutHistoryItem} from './models/entities';
import {DataFactory} from './factory';

const workoutBankDruecken: Workout = {
    id: 0,
    type: EWorkoutType.BankDruecken,
    name: "Bank Drücken",
    repetitions: 1,
    sets: 1,
    weight: 50,
};

const workoutButterfly: Workout = {
    id: 1,
    name: "Butterfly",
    type: EWorkoutType.Butterfly,
    repetitions: 5,
    sets: 4,
    weight: 12,
};

const workoutTrizeps: Workout = {
    id: 2,
    name: "Trizeps Curls",
    type: EWorkoutType.TrizepsCurls,
    repetitions: 32,
    sets: 5,
    weight: 7,
};

const workoutDips: Workout = {
    id: 4,
    type: EWorkoutType.Dips,
    name: "Dips",
    repetitions: 10,
    sets: 4,
    weight: 3,
};

export const testHistory: WorkoutHistoryItem[] = [
    DataFactory.createWorkoutHistoryItem(workoutBankDruecken),
    DataFactory.createWorkoutHistoryItem(workoutBankDruecken),
    DataFactory.createWorkoutHistoryItem(workoutButterfly),
    DataFactory.createWorkoutHistoryItem(workoutTrizeps),
    DataFactory.createWorkoutHistoryItem(workoutTrizeps),
    DataFactory.createWorkoutHistoryItem(workoutDips),
];

export const testPlan: TrainingPlan = DataFactory.createTrainingPlan("Test Plan", [
   DataFactory.createTrainingDay("Test Tag 1", [workoutBankDruecken, workoutButterfly]),
   DataFactory.createTrainingDay("Test Tag 2", [workoutTrizeps, workoutButterfly]),
   DataFactory.createTrainingDay("Test Tag 3", [workoutBankDruecken, workoutDips]),
   DataFactory.createTrainingDay("Test Tag 4", [workoutButterfly, workoutTrizeps]),
]);

export class TestData {
    public static plan: TrainingPlan = testPlan;
    public static history: WorkoutHistoryItem[] = testHistory;
    public static workouts: Workout[] = [
        workoutButterfly,
        workoutTrizeps,
        workoutBankDruecken,
        workoutDips
    ];
}


