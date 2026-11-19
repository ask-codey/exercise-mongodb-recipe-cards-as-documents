// Sunday Kitchen's recipe cards: three handwritten cards for you to turn into documents.
//
// Each function gets `db`, which works like mongosh: db.cards is Sunday Kitchen's cards collection. When each test
// starts, it holds one card, Saturday Pancakes (card 1, in data/cards.json), written the way every card should be:
//
//   { _id: 1, name: "Saturday Pancakes", cuisine: "American", meal: "breakfast", minutes: 25, servings: 4,
//     vegetarian: true, rating: 4.6, tags: ["sweet", "kid-friendly"],
//     ingredients: [ { name: "flour", amount: 2, unit: "cup" }, ... six more ..., { name: "vanilla", amount: 1, unit: "teaspoon" } ],
//     nutrition: { calories: 310, protein: 9 }, costPerServing: NumberDecimal("0.85"), added: ISODate("2026-01-10") }
//
// Each function starts an insertOne with the card's _id and name. Add every other field the comment above it lists,
// each with the right type: text in quotes, numbers without, true or false, a list in square brackets, a document in
// braces, money with NumberDecimal("...") and a date with ISODate("..."). Spell each field name exactly as card 1 does,
// and add no other fields. The cards leave out the steps, so there's less to type.
// You can try an insertOne in mongosh first (README.md, "Try it in mongosh") and paste it in.

// mongosh's helpers for ids, dates and money. This exercise uses ISODate and NumberDecimal; leave this line as it is.
import { ObjectId, ISODate, NumberDecimal } from "./test/mongosh-helper.js";

/*
 * 1. Card 2, Weeknight Chili.
 *
 *    _id 2 and name "Weeknight Chili" are there already. Add:
 *    cuisine "American", meal "dinner", minutes 45, servings 6, vegetarian false, rating 4.4,
 *    tags, in this order: "spicy", "make-ahead",
 *    ingredients, in this order, each a document with a name, an amount and a unit:
 *      ground beef, 1, pound / kidney beans, 2, can / crushed tomatoes, 1, can / chili powder, 2, tablespoon
 *    nutrition, a document: calories 420, protein 28,
 *    costPerServing, money: 2.10, written NumberDecimal("2.10"),
 *    added, a date: January 12, 2026, written ISODate("2026-01-12").
 */
export function addWeeknightChili(db) {
  return db.cards.insertOne({ _id: 2, name: "Weeknight Chili" });
}

/*
 * 2. Card 3, Lemon Bars.
 *
 *    _id 3 and name "Lemon Bars" are there already. Add:
 *    cuisine "American", meal "dessert", minutes 50, servings 16, vegetarian true, rating 4.8,
 *    tags, in this order: "sweet", "bake-sale",
 *    ingredients, in this order, each a document with a name, an amount and a unit:
 *      flour, 2, cup / butter, 1, cup / sugar, 1.5, cup / lemons, 3, whole
 *    nutrition, a document: calories 190, protein 2,
 *    costPerServing, money: 0.45, written NumberDecimal("0.45"),
 *    added, a date: January 17, 2026, written ISODate("2026-01-17").
 */
export function addLemonBars(db) {
  return db.cards.insertOne({ _id: 3, name: "Lemon Bars" });
}

/*
 * 3. Card 4, Chickpea Curry.
 *
 *    _id 4 and name "Chickpea Curry" are there already. Add:
 *    cuisine "Indian", meal "dinner", minutes 35, servings 4, vegetarian true, rating 4.7,
 *    tags, in this order: "vegan", "spicy",
 *    ingredients, in this order, each a document with a name, an amount and a unit:
 *      chickpeas, 2, can / coconut milk, 1, can / onion, 1, whole / curry powder, 2, tablespoon
 *    nutrition, a document: calories 380, protein 14,
 *    costPerServing, money: 1.75, written NumberDecimal("1.75"),
 *    added, a date: January 20, 2026, written ISODate("2026-01-20").
 */
export function addChickpeaCurry(db) {
  return db.cards.insertOne({ _id: 4, name: "Chickpea Curry" });
}
