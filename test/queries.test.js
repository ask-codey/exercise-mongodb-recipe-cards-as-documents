// Tests for queries.js. Run them with: npm test
// Each test calls one of your functions on Sunday Kitchen's cards collection (data/cards.json, loaded fresh before
// every test), then reads back the card it added and checks every field: that it's there, that it has the right type,
// and that it holds the right value. You don't need to change this file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestDatabase, run, documentsIn } from "./mongosh-helper.js";
import { addWeeknightChili, addLemonBars, addChickpeaCurry } from "../queries.js";

startTestDatabase();

// ---- what each card should hold ----

const money = (text) => ({ money: text }); // NumberDecimal("...")
const date = (text) => ({ date: text }); // ISODate("...")

const cards = {
  2: {
    simple: { _id: 2, name: "Weeknight Chili", cuisine: "American", meal: "dinner", minutes: 45, servings: 6,
      vegetarian: false, rating: 4.4, costPerServing: money("2.10"), added: date("2026-01-12") },
    tags: ["spicy", "make-ahead"],
    ingredients: [["ground beef", 1, "pound"], ["kidney beans", 2, "can"], ["crushed tomatoes", 1, "can"],
      ["chili powder", 2, "tablespoon"]],
    nutrition: { calories: 420, protein: 28 },
  },
  3: {
    simple: { _id: 3, name: "Lemon Bars", cuisine: "American", meal: "dessert", minutes: 50, servings: 16,
      vegetarian: true, rating: 4.8, costPerServing: money("0.45"), added: date("2026-01-17") },
    tags: ["sweet", "bake-sale"],
    ingredients: [["flour", 2, "cup"], ["butter", 1, "cup"], ["sugar", 1.5, "cup"], ["lemons", 3, "whole"]],
    nutrition: { calories: 190, protein: 2 },
  },
  4: {
    simple: { _id: 4, name: "Chickpea Curry", cuisine: "Indian", meal: "dinner", minutes: 35, servings: 4,
      vegetarian: true, rating: 4.7, costPerServing: money("1.75"), added: date("2026-01-20") },
    tags: ["vegan", "spicy"],
    ingredients: [["chickpeas", 2, "can"], ["coconut milk", 1, "can"], ["onion", 1, "whole"],
      ["curry powder", 2, "tablespoon"]],
    nutrition: { calories: 380, protein: 14 },
  },
};

// ---- describing values the way mongosh writes them ----

function kind(value) {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (typeof value === "string") return "text";
  if (typeof value === "number") return "a number";
  if (typeof value === "boolean") return "true or false";
  if (value instanceof Date) return "a date";
  if (value?._bsontype === "Decimal128") return "money (NumberDecimal)";
  if (Array.isArray(value)) return "a list";
  return "a document";
}

function show(value) {
  switch (kind(value)) {
    case "text": return JSON.stringify(value);
    case "a date": return `ISODate("${value.toISOString().replace("T00:00:00.000Z", "")}")`;
    case "money (NumberDecimal)": return `NumberDecimal("${value.toString()}")`;
    case "a list": return `[${value.map(show).join(", ")}]`;
    case "a document": return `{ ${Object.entries(value).map(([k, v]) => `${k}: ${show(v)}`).join(", ")} }`;
    default: return String(value);
  }
}

// What a field should be, in words and as mongosh would write it.
function wanted(expected) {
  if (expected?.money !== undefined) return { kind: "money (NumberDecimal)", text: `NumberDecimal("${expected.money}")` };
  if (expected?.date !== undefined) return { kind: "a date", text: `ISODate("${expected.date}")` };
  return { kind: kind(expected), text: show(expected) };
}

function sameValue(actual, expected) {
  if (expected?.money !== undefined) return Number(actual.toString()) === Number(expected.money);
  if (expected?.date !== undefined) return actual.getTime() === new Date(expected.date).getTime();
  return actual === expected;
}

// ---- reading the card back ----

async function cardAfter(number, yourFunction, id) {
  await run(yourFunction);
  const card = (await documentsIn("cards")).find((document) => document._id === id);
  assert.ok(card,
    `${number}) ${yourFunction.name} should add the card with _id ${id}, but the cards collection has no such card. ` +
    `Keep db.cards.insertOne({ _id: ${id}, ... }) after return, with _id as a number.`);
  return card;
}

// Checks one field: there, the right type, the right value.
function checkField(number, card, field, expected) {
  const want = wanted(expected);
  const actual = card[field];
  assert.ok(actual !== undefined,
    `${number}) ${card.name} has no ${field} field. The card says ${field}: ${want.text}. Check the field's spelling too.`);
  assert.equal(kind(actual), want.kind,
    `${number}) ${card.name}: ${field} should be ${want.kind}, ${want.text}, but it's ${kind(actual)}: ${show(actual)}.` +
    (want.kind === "a number" && kind(actual) === "text" ? " Take the quotes off a number." : "") +
    (want.kind === "money (NumberDecimal)" ? " Money goes in NumberDecimal, with the amount in quotes." : "") +
    (want.kind === "a date" ? " A date goes in ISODate, with the date in quotes." : ""));
  assert.ok(sameValue(actual, expected),
    `${number}) ${card.name}: ${field} should be ${want.text}, but it's ${show(actual)}.`);
}

function checkSimpleFields(number, card, expected) {
  for (const [field, value] of Object.entries(expected.simple)) {
    checkField(number, card, field, value);
  }
  const allowed = [...Object.keys(expected.simple), "tags", "ingredients", "nutrition"];
  const extra = Object.keys(card).filter((field) => !allowed.includes(field));
  assert.deepEqual(extra, [],
    `${number}) ${card.name} has a field the card doesn't list: ${extra.join(", ")}. Check its spelling, or take it out.`);
}

function checkListsAndNutrition(number, card, expected) {
  // tags: a list of text, in the card's order
  assert.ok(card.tags !== undefined,
    `${number}) ${card.name} has no tags field. The card says tags: ${show(expected.tags)}.`);
  assert.equal(kind(card.tags), "a list",
    `${number}) ${card.name}: tags should be a list in square brackets, ${show(expected.tags)}, but it's ${kind(card.tags)}: ${show(card.tags)}.`);
  assert.deepEqual(card.tags, expected.tags,
    `${number}) ${card.name}: tags should be ${show(expected.tags)}, in that order, but they're ${show(card.tags)}.`);

  // ingredients: a list of documents, each with a name, an amount and a unit
  const want = expected.ingredients.map(([name, amount, unit]) => ({ name, amount, unit }));
  assert.ok(card.ingredients !== undefined,
    `${number}) ${card.name} has no ingredients field. The card lists ${want.length} ingredients.`);
  assert.equal(kind(card.ingredients), "a list",
    `${number}) ${card.name}: ingredients should be a list in square brackets, with a document for each ingredient, but it's ${kind(card.ingredients)}: ${show(card.ingredients)}.`);
  assert.equal(card.ingredients.length, want.length,
    `${number}) ${card.name} should have ${want.length} ingredients, but its list has ${card.ingredients.length}: ${show(card.ingredients)}.`);
  want.forEach((ingredient, index) => {
    const actual = card.ingredients[index];
    const place = `${card.name}, ingredient ${index + 1}`;
    assert.equal(kind(actual), "a document",
      `${number}) ${place} should be a document, ${show(ingredient)}, but it's ${kind(actual)}: ${show(actual)}.`);
    for (const [field, value] of Object.entries(ingredient)) {
      assert.ok(actual[field] !== undefined,
        `${number}) ${place} has no ${field} field. It should be ${show(ingredient)}.`);
      assert.equal(kind(actual[field]), kind(value),
        `${number}) ${place}: ${field} should be ${kind(value)}, ${show(value)}, but it's ${kind(actual[field])}: ${show(actual[field])}.` +
        (kind(value) === "a number" && kind(actual[field]) === "text" ? " Take the quotes off a number." : ""));
      assert.equal(actual[field], value,
        `${number}) ${place}: ${field} should be ${show(value)}, but it's ${show(actual[field])}.`);
    }
    const extra = Object.keys(actual).filter((field) => !(field in ingredient));
    assert.deepEqual(extra, [],
      `${number}) ${place} has a field it shouldn't: ${extra.join(", ")}. Each ingredient has only name, amount and unit.`);
  });

  // nutrition: a document inside the card
  assert.ok(card.nutrition !== undefined,
    `${number}) ${card.name} has no nutrition field. The card says nutrition: ${show(expected.nutrition)}.`);
  assert.equal(kind(card.nutrition), "a document",
    `${number}) ${card.name}: nutrition should be a document in braces, ${show(expected.nutrition)}, but it's ${kind(card.nutrition)}: ${show(card.nutrition)}.`);
  assert.deepEqual(card.nutrition, expected.nutrition,
    `${number}) ${card.name}: nutrition should be ${show(expected.nutrition)}, with numbers and no other fields, but it's ${show(card.nutrition)}.`);
}

// ---- the tests: two for each card ----

const tasks = [
  [1, addWeeknightChili, 2, "Weeknight Chili"],
  [2, addLemonBars, 3, "Lemon Bars"],
  [3, addChickpeaCurry, 4, "Chickpea Curry"],
];

for (const [task, yourFunction, id, name] of tasks) {
  const first = task * 2 - 1;
  const second = task * 2;

  test(`${first}) ${yourFunction.name} stores card ${id}, ${name}, with its text, numbers, true or false, money and date as the right types`, async () => {
    const card = await cardAfter(first, yourFunction, id);
    checkSimpleFields(first, card, cards[id]);
  });

  test(`${second}) ${yourFunction.name} stores card ${id}'s tags as a list, its ingredients as a list of documents and its nutrition as a document`, async () => {
    const card = await cardAfter(second, yourFunction, id);
    checkListsAndNutrition(second, card, cards[id]);
  });
}
