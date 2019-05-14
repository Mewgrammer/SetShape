import {TrainingDay, TrainingPlan, Workout, WorkoutHistoryItem} from './models/entities';
import {EWorkoutType} from './models/interfaces';

export class DataFactory {

    private static TrainingDayId = 1;
    private static TrainingPlanId = 1;
    private static WorkoutId = 1;
    private static HistoryItemId = 1;

    public static createTrainingDay(name: string, workouts: Workout[]) {
        const day = new TrainingDay();
        day.id = DataFactory.TrainingDayId++;
        day.name = name;
        day.workouts = workouts;
        return day;
    }

    public static createTrainingPlan(name: string, days: TrainingDay[]) {
        const plan = new TrainingPlan();
        plan.id = DataFactory.TrainingPlanId++;
        plan.name = name;
        plan.days = days;
        return plan;
    }

    public static createWorkoutHistoryItem(workout: Workout) {
        const item = new WorkoutHistoryItem();
        item.id = DataFactory.WorkoutId++;
        item.Date = new Date();
        item.workout = workout;
        return item;
    }

    public static createWorkout(name: string, type: EWorkoutType, repetitions: number, sets: number, weight: number) {
        const workout = new Workout();
        workout.id = DataFactory.WorkoutId++;
        workout.name = name;
        workout.repetitions = repetitions;
        workout.sets = sets;
        workout.weight = weight;
        return workout;
    }

    public static createTrainingDayForDatabase(name: string, workouts: Workout[]) {
        const day = new TrainingDay();
        day.name = name;
        day.workouts = workouts;
        return day;
    }

    public static createTrainingPlanForDatabase(name: string, days: TrainingDay[]) {
        const plan = new TrainingPlan();
        plan.name = name;
        plan.days = days;
        return plan;
    }

    public static createWorkoutHistoryItemForDatabase(workout: Workout) {
        const item = new WorkoutHistoryItem();
        item.Date = new Date();
        item.workout = workout;
        return item;
    }

    public static createWorkoutForDatabase(name: string, type: EWorkoutType, repetitions: number, sets: number, weight: number) {
        const workout = new Workout();
        workout.name = name;
        workout.repetitions = repetitions;
        workout.sets = sets;
        workout.weight = weight;
        return workout;
    }


}
