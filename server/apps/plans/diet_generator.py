"""
Diet Plan Generator with Template-Based Meal Selection.

Uses pre-defined meal templates and smart selection based on:
- User's calculated TDEE (Total Daily Energy Expenditure)
- Allergies/dietary restrictions
- Variety (no repeat meals in same day)
"""

import random
from typing import List, Dict, Any, Optional


# Meal database with nutritional info and restrictions
MEALS = [
    # BREAKFAST OPTIONS
    {
        "id": 1,
        "name": "Oatmeal with Berries",
        "category": "breakfast",
        "calories": 350,
        "protein": 10,
        "carbs": 55,
        "fats": 8,
        "restrictions": ["dairy-free", "nut-free"],
        "ingredients": ["oats", "mixed berries", "honey", "cinnamon"],
        "contains": []
    },
    {
        "id": 2,
        "name": "Greek Yogurt Parfait",
        "category": "breakfast",
        "calories": 320,
        "protein": 18,
        "carbs": 40,
        "fats": 10,
        "restrictions": ["gluten-free", "nut-free"],
        "ingredients": ["greek yogurt", "granola", "honey", "strawberries"],
        "contains": ["dairy"]
    },
    {
        "id": 3,
        "name": "Scrambled Eggs with Toast",
        "category": "breakfast",
        "calories": 400,
        "protein": 20,
        "carbs": 30,
        "fats": 22,
        "restrictions": ["nut-free"],
        "ingredients": ["eggs", "whole wheat toast", "butter", "salt", "pepper"],
        "contains": ["dairy", "gluten", "eggs"]
    },
    {
        "id": 4,
        "name": "Avocado Toast with Egg",
        "category": "breakfast",
        "calories": 380,
        "protein": 15,
        "carbs": 35,
        "fats": 20,
        "restrictions": ["dairy-free", "nut-free"],
        "ingredients": ["sourdough bread", "avocado", "poached egg", "cherry tomatoes"],
        "contains": ["gluten", "eggs"]
    },
    {
        "id": 5,
        "name": "Banana Almond Smoothie",
        "category": "breakfast",
        "calories": 340,
        "protein": 12,
        "carbs": 45,
        "fats": 14,
        "restrictions": ["gluten-free", "dairy-free", "vegan"],
        "ingredients": ["banana", "almond milk", "almond butter", "honey", "chia seeds"],
        "contains": ["nuts"]
    },
    {
        "id": 6,
        "name": "Vegetable Omelette",
        "category": "breakfast",
        "calories": 320,
        "protein": 22,
        "carbs": 8,
        "fats": 24,
        "restrictions": ["gluten-free", "nut-free"],
        "ingredients": ["eggs", "spinach", "tomatoes", "bell peppers", "cheese"],
        "contains": ["dairy", "eggs"]
    },
    {
        "id": 7,
        "name": "Whole Grain Pancakes",
        "category": "breakfast",
        "calories": 420,
        "protein": 12,
        "carbs": 60,
        "fats": 14,
        "restrictions": ["nut-free"],
        "ingredients": ["whole wheat flour", "eggs", "milk", "maple syrup", "butter"],
        "contains": ["dairy", "gluten", "eggs"]
    },
    {
        "id": 8,
        "name": "Chia Pudding with Mango",
        "category": "breakfast",
        "calories": 280,
        "protein": 8,
        "carbs": 35,
        "fats": 12,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["chia seeds", "coconut milk", "mango", "maple syrup"],
        "contains": []
    },

    # LUNCH OPTIONS
    {
        "id": 10,
        "name": "Grilled Chicken Salad",
        "category": "lunch",
        "calories": 450,
        "protein": 35,
        "carbs": 20,
        "fats": 28,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["grilled chicken", "mixed greens", "tomatoes", "cucumber", "olive oil dressing"],
        "contains": []
    },
    {
        "id": 11,
        "name": "Turkey & Avocado Wrap",
        "category": "lunch",
        "calories": 520,
        "protein": 30,
        "carbs": 45,
        "fats": 24,
        "restrictions": ["dairy-free", "nut-free"],
        "ingredients": ["whole wheat tortilla", "turkey breast", "avocado", "lettuce", "tomato"],
        "contains": ["gluten"]
    },
    {
        "id": 12,
        "name": "Quinoa Buddha Bowl",
        "category": "lunch",
        "calories": 480,
        "protein": 18,
        "carbs": 55,
        "fats": 22,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["quinoa", "chickpeas", "roasted vegetables", "tahini dressing", "avocado"],
        "contains": ["sesame"]
    },
    {
        "id": 13,
        "name": "Salmon Poke Bowl",
        "category": "lunch",
        "calories": 550,
        "protein": 32,
        "carbs": 50,
        "fats": 22,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["salmon", "sushi rice", "edamame", "cucumber", "avocado", "soy sauce"],
        "contains": ["fish", "soy"]
    },
    {
        "id": 14,
        "name": "Mediterranean Hummus Plate",
        "category": "lunch",
        "calories": 460,
        "protein": 15,
        "carbs": 50,
        "fats": 24,
        "restrictions": ["dairy-free", "nut-free", "vegan"],
        "ingredients": ["hummus", "falafel", "pita bread", "tabbouleh", "olives"],
        "contains": ["gluten", "sesame"]
    },
    {
        "id": 15,
        "name": "Chicken Caesar Salad",
        "category": "lunch",
        "calories": 480,
        "protein": 38,
        "carbs": 18,
        "fats": 30,
        "restrictions": ["nut-free"],
        "ingredients": ["grilled chicken", "romaine lettuce", "parmesan cheese", "caesar dressing", "croutons"],
        "contains": ["dairy", "gluten", "eggs"]
    },
    {
        "id": 16,
        "name": "Veggie Stir-Fry with Tofu",
        "category": "lunch",
        "calories": 420,
        "protein": 20,
        "carbs": 45,
        "fats": 18,
        "restrictions": ["dairy-free", "nut-free", "vegan"],
        "ingredients": ["tofu", "brown rice", "broccoli", "carrots", "soy sauce", "ginger"],
        "contains": ["soy", "gluten"]
    },
    {
        "id": 17,
        "name": "Tuna Nicoise Salad",
        "category": "lunch",
        "calories": 440,
        "protein": 32,
        "carbs": 25,
        "fats": 26,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["tuna", "hard boiled eggs", "green beans", "potatoes", "olives", "vinaigrette"],
        "contains": ["fish", "eggs"]
    },

    # DINNER OPTIONS
    {
        "id": 20,
        "name": "Grilled Salmon with Vegetables",
        "category": "dinner",
        "calories": 520,
        "protein": 40,
        "carbs": 25,
        "fats": 28,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["salmon fillet", "asparagus", "sweet potato", "lemon", "olive oil"],
        "contains": ["fish"]
    },
    {
        "id": 21,
        "name": "Chicken Breast with Quinoa",
        "category": "dinner",
        "calories": 550,
        "protein": 45,
        "carbs": 40,
        "fats": 20,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["chicken breast", "quinoa", "roasted broccoli", "garlic", "herbs"],
        "contains": []
    },
    {
        "id": 22,
        "name": "Beef Stir-Fry with Brown Rice",
        "category": "dinner",
        "calories": 580,
        "protein": 35,
        "carbs": 50,
        "fats": 25,
        "restrictions": ["dairy-free", "nut-free"],
        "ingredients": ["lean beef", "brown rice", "mixed vegetables", "soy sauce", "sesame oil"],
        "contains": ["soy", "sesame"]
    },
    {
        "id": 23,
        "name": "Baked Cod with Roasted Potatoes",
        "category": "dinner",
        "calories": 480,
        "protein": 38,
        "carbs": 40,
        "fats": 18,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["cod fillet", "baby potatoes", "cherry tomatoes", "herbs", "olive oil"],
        "contains": ["fish"]
    },
    {
        "id": 24,
        "name": "Vegetarian Pasta Primavera",
        "category": "dinner",
        "calories": 520,
        "protein": 18,
        "carbs": 70,
        "fats": 18,
        "restrictions": ["nut-free", "vegan"],
        "ingredients": ["whole wheat pasta", "zucchini", "bell peppers", "tomatoes", "olive oil", "basil"],
        "contains": ["gluten"]
    },
    {
        "id": 25,
        "name": "Turkey Meatballs with Zoodles",
        "category": "dinner",
        "calories": 450,
        "protein": 38,
        "carbs": 20,
        "fats": 25,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["ground turkey", "zucchini noodles", "marinara sauce", "herbs", "garlic"],
        "contains": []
    },
    {
        "id": 26,
        "name": "Lentil Curry with Basmati Rice",
        "category": "dinner",
        "calories": 490,
        "protein": 22,
        "carbs": 65,
        "fats": 14,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["red lentils", "basmati rice", "coconut milk", "curry spices", "spinach"],
        "contains": []
    },
    {
        "id": 27,
        "name": "Grilled Shrimp Tacos",
        "category": "dinner",
        "calories": 480,
        "protein": 30,
        "carbs": 45,
        "fats": 20,
        "restrictions": ["dairy-free", "nut-free"],
        "ingredients": ["shrimp", "corn tortillas", "cabbage slaw", "avocado", "lime", "cilantro"],
        "contains": ["shellfish"]
    },
    {
        "id": 28,
        "name": "Chicken Tikka Masala",
        "category": "dinner",
        "calories": 560,
        "protein": 35,
        "carbs": 45,
        "fats": 28,
        "restrictions": ["gluten-free", "nut-free"],
        "ingredients": ["chicken", "basmati rice", "tomato sauce", "yogurt", "spices"],
        "contains": ["dairy"]
    },

    # SNACK OPTIONS
    {
        "id": 30,
        "name": "Apple with Almond Butter",
        "category": "snack",
        "calories": 200,
        "protein": 5,
        "carbs": 25,
        "fats": 10,
        "restrictions": ["gluten-free", "dairy-free", "vegan"],
        "ingredients": ["apple", "almond butter"],
        "contains": ["nuts"]
    },
    {
        "id": 31,
        "name": "Greek Yogurt with Honey",
        "category": "snack",
        "calories": 150,
        "protein": 12,
        "carbs": 18,
        "fats": 4,
        "restrictions": ["gluten-free", "nut-free"],
        "ingredients": ["greek yogurt", "honey"],
        "contains": ["dairy"]
    },
    {
        "id": 32,
        "name": "Hummus with Veggie Sticks",
        "category": "snack",
        "calories": 180,
        "protein": 6,
        "carbs": 20,
        "fats": 10,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["hummus", "carrots", "celery", "cucumber"],
        "contains": ["sesame"]
    },
    {
        "id": 33,
        "name": "Mixed Nuts",
        "category": "snack",
        "calories": 180,
        "protein": 5,
        "carbs": 8,
        "fats": 16,
        "restrictions": ["gluten-free", "dairy-free", "vegan"],
        "ingredients": ["almonds", "walnuts", "cashews"],
        "contains": ["nuts"]
    },
    {
        "id": 34,
        "name": "Protein Energy Balls",
        "category": "snack",
        "calories": 160,
        "protein": 8,
        "carbs": 18,
        "fats": 8,
        "restrictions": ["gluten-free", "dairy-free"],
        "ingredients": ["oats", "peanut butter", "honey", "dark chocolate chips"],
        "contains": ["nuts"]
    },
    {
        "id": 35,
        "name": "Cottage Cheese with Pineapple",
        "category": "snack",
        "calories": 140,
        "protein": 14,
        "carbs": 15,
        "fats": 3,
        "restrictions": ["gluten-free", "nut-free"],
        "ingredients": ["cottage cheese", "pineapple chunks"],
        "contains": ["dairy"]
    },
    {
        "id": 36,
        "name": "Rice Cakes with Avocado",
        "category": "snack",
        "calories": 150,
        "protein": 3,
        "carbs": 18,
        "fats": 8,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["rice cakes", "avocado", "sea salt"],
        "contains": []
    },
    {
        "id": 37,
        "name": "Hard Boiled Eggs",
        "category": "snack",
        "calories": 140,
        "protein": 12,
        "carbs": 1,
        "fats": 10,
        "restrictions": ["gluten-free", "dairy-free", "nut-free"],
        "ingredients": ["eggs", "salt", "pepper"],
        "contains": ["eggs"]
    },
    {
        "id": 38,
        "name": "Fresh Fruit Salad",
        "category": "snack",
        "calories": 120,
        "protein": 2,
        "carbs": 30,
        "fats": 0,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["strawberries", "blueberries", "grapes", "kiwi"],
        "contains": []
    },
    {
        "id": 39,
        "name": "Edamame",
        "category": "snack",
        "calories": 120,
        "protein": 11,
        "carbs": 10,
        "fats": 5,
        "restrictions": ["gluten-free", "dairy-free", "nut-free", "vegan"],
        "ingredients": ["edamame", "sea salt"],
        "contains": ["soy"]
    },
]

# Allergy mapping
ALLERGY_MAPPING = {
    "nuts": ["nuts"],
    "dairy": ["dairy"],
    "gluten": ["gluten"],
    "eggs": ["eggs"],
    "fish": ["fish"],
    "shellfish": ["shellfish"],
    "soy": ["soy"],
    "sesame": ["sesame"],
}

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def calculate_bmr(weight: float, height: float, age: int = 30, gender: str = "male") -> float:
    """
    Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation.

    Args:
        weight: Weight in kg
        height: Height in cm
        age: Age in years (default 30)
        gender: 'male' or 'female'

    Returns:
        BMR in calories
    """
    if gender.lower() == "male":
        return (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        return (10 * weight) + (6.25 * height) - (5 * age) - 161


def calculate_tdee(bmr: float, activity_level: str = "moderate") -> float:
    """
    Calculate Total Daily Energy Expenditure.

    Args:
        bmr: Basal Metabolic Rate
        activity_level: sedentary, light, moderate, active, very_active

    Returns:
        TDEE in calories
    """
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    return bmr * activity_multipliers.get(activity_level, 1.55)


def adjust_calories_for_goal(tdee: float, goal: str) -> float:
    """
    Adjust daily calories based on weight goal.

    Args:
        tdee: Total Daily Energy Expenditure
        goal: 'lose', 'maintain', or 'gain'

    Returns:
        Target daily calories
    """
    if goal == "lose":
        return tdee - 500  # ~0.5kg loss per week
    elif goal == "gain":
        return tdee + 300  # Lean bulk
    return tdee  # maintain


def filter_meals_by_allergies(meals: List[Dict], allergies: List[str]) -> List[Dict]:
    """
    Filter out meals containing any of the specified allergens.

    Args:
        meals: List of meal dictionaries
        allergies: List of allergy strings (e.g., ['nuts', 'dairy'])

    Returns:
        Filtered list of safe meals
    """
    if not allergies:
        return meals

    safe_meals = []
    allergy_set = set()

    # Expand allergies to all related terms
    for allergy in allergies:
        allergy_lower = allergy.lower()
        if allergy_lower in ALLERGY_MAPPING:
            allergy_set.update(ALLERGY_MAPPING[allergy_lower])
        else:
            allergy_set.add(allergy_lower)

    for meal in meals:
        contains = set(item.lower() for item in meal.get("contains", []))
        if not contains.intersection(allergy_set):
            safe_meals.append(meal)

    return safe_meals


def get_meals_by_category(meals: List[Dict], category: str) -> List[Dict]:
    """Get meals filtered by category."""
    return [m for m in meals if m["category"] == category]


def select_meal_for_calorie_target(
    meals: List[Dict],
    target_calories: float,
    used_meal_ids: set,
    tolerance: float = 0.3
) -> Optional[Dict]:
    """
    Select a meal close to target calories that hasn't been used.

    Args:
        meals: Available meals
        target_calories: Target calorie amount
        used_meal_ids: Set of already used meal IDs
        tolerance: Acceptable deviation from target (0.3 = 30%)

    Returns:
        Selected meal or None
    """
    available = [m for m in meals if m["id"] not in used_meal_ids]
    if not available:
        # If all meals used, allow repeats
        available = meals

    min_cal = target_calories * (1 - tolerance)
    max_cal = target_calories * (1 + tolerance)

    # Filter by calorie range
    suitable = [m for m in available if min_cal <= m["calories"] <= max_cal]

    if suitable:
        return random.choice(suitable)

    # If no suitable meals, pick closest
    if available:
        return min(available, key=lambda m: abs(m["calories"] - target_calories))

    return None


def generate_weekly_plan(
    height: float,
    weight: float,
    allergies: List[str],
    goal: str = "maintain",
    age: int = 30,
    gender: str = "male",
    activity_level: str = "moderate"
) -> Dict[str, Any]:
    """
    Generate a complete 7-day meal plan.

    Args:
        height: Height in cm
        weight: Weight in kg
        allergies: List of allergies
        goal: 'lose', 'maintain', or 'gain'
        age: Age in years
        gender: 'male' or 'female'
        activity_level: Activity level

    Returns:
        Complete meal plan with nutritional info
    """
    # Calculate calorie needs
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    daily_target = adjust_calories_for_goal(tdee, goal)

    # Filter meals by allergies
    safe_meals = filter_meals_by_allergies(MEALS, allergies)

    # Get meals by category
    breakfasts = get_meals_by_category(safe_meals, "breakfast")
    lunches = get_meals_by_category(safe_meals, "lunch")
    dinners = get_meals_by_category(safe_meals, "dinner")
    snacks = get_meals_by_category(safe_meals, "snack")

    # Calculate target calories per meal type
    # Typical distribution: Breakfast 25%, Lunch 30%, Dinner 35%, Snacks 10%
    breakfast_target = daily_target * 0.25
    lunch_target = daily_target * 0.30
    dinner_target = daily_target * 0.35
    snack_target = daily_target * 0.10

    week_plan = []
    used_breakfast_ids = set()
    used_lunch_ids = set()
    used_dinner_ids = set()
    used_snack_ids = set()

    for day in DAYS_OF_WEEK:
        # Select meals for the day
        breakfast = select_meal_for_calorie_target(
            breakfasts, breakfast_target, used_breakfast_ids
        )
        lunch = select_meal_for_calorie_target(
            lunches, lunch_target, used_lunch_ids
        )
        dinner = select_meal_for_calorie_target(
            dinners, dinner_target, used_dinner_ids
        )
        snack = select_meal_for_calorie_target(
            snacks, snack_target, used_snack_ids
        )

        # Track used meals
        if breakfast:
            used_breakfast_ids.add(breakfast["id"])
        if lunch:
            used_lunch_ids.add(lunch["id"])
        if dinner:
            used_dinner_ids.add(dinner["id"])
        if snack:
            used_snack_ids.add(snack["id"])

        # Calculate day totals
        day_calories = sum(m["calories"] for m in [breakfast, lunch, dinner, snack] if m)
        day_protein = sum(m["protein"] for m in [breakfast, lunch, dinner, snack] if m)
        day_carbs = sum(m["carbs"] for m in [breakfast, lunch, dinner, snack] if m)
        day_fats = sum(m["fats"] for m in [breakfast, lunch, dinner, snack] if m)

        day_plan = {
            "day": day,
            "meals": {
                "breakfast": breakfast,
                "lunch": lunch,
                "dinner": dinner,
                "snack": snack,
            },
            "totals": {
                "calories": day_calories,
                "protein": day_protein,
                "carbs": day_carbs,
                "fats": day_fats,
            }
        }
        week_plan.append(day_plan)

    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "daily_calorie_target": round(daily_target),
        "goal": goal,
        "user_info": {
            "height": height,
            "weight": weight,
            "age": age,
            "gender": gender,
            "activity_level": activity_level,
        },
        "allergies": allergies,
        "week_plan": week_plan,
    }
