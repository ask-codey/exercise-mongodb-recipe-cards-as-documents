# Exercise: Recipe Cards as Documents

Exercise code for the lesson **Exercise: Recipe Cards as Documents** in the MongoDB in Depth course on [ask-codey.com](https://www.ask-codey.com).

Sunday Kitchen is moving its recipes off paper. Three handwritten cards are left to type in: Weeknight Chili, Lemon Bars and Chickpea Curry. You'll turn each card into one document, with every value the right type, its tags as a list, its ingredients as a list of documents and its nutrition box as a document inside it, and insert it with `insertOne` in `queries.js`. Tests read each card back and check every field and its type.

## What's here

- `queries.js`: the three functions, one per card. Each starts an `insertOne` with the card's `_id` and name; the comment above it lists every field to add. For you to finish.
- `data/cards.json`: card 1, Saturday Pancakes, already typed in the way every card should be. It's the example to copy the shape from. Ready to use.
- `data/load-into-mongosh.js`: loads card 1 into mongosh, so you can try an insert there first. Ready to use.
- `test/queries.test.js`: the tests that read your cards back. You don't need to change this file.
- `test/mongosh-helper.js`: the helper that runs your mongosh statements for the tests, with a throwaway MongoDB. You don't need to read or change it.
- `package.json`: the packages the tests use, and the MongoDB version they download if your computer has none. Ready to use.

The word `export` in front of each function lets the tests use it, and the `import` line at the top of `queries.js` brings in mongosh's `NumberDecimal` and `ISODate`, which this exercise needs. Leave both as they are.

## The three cards

The cards leave out the steps, so there's less to type. Each card's text is written out under its picture.

### Card 2: Weeknight Chili

![Card 2, Weeknight Chili, handwritten on a lined index card: American, dinner, 45 minutes, serves 6, not vegetarian, rated 4.4; tags spicy and make-ahead; 1 pound ground beef, 2 cans kidney beans, 1 can crushed tomatoes, 2 tablespoons chili powder; 420 calories and 28 grams of protein a serving; $2.10 a serving; added January 12, 2026.](images/card-2-weeknight-chili.png)

- American · dinner · 45 minutes · serves 6 · not vegetarian · rated 4.4
- Tags: spicy, make-ahead
- Ingredients: 1 pound ground beef · 2 cans kidney beans · 1 can crushed tomatoes · 2 tablespoons chili powder
- Per serving: 420 calories, 28 g protein · costs $2.10
- Added January 12, 2026

### Card 3: Lemon Bars

![Card 3, Lemon Bars, handwritten on a lined index card: American, dessert, 50 minutes, serves 16, vegetarian, rated 4.8; tags sweet and bake-sale; 2 cups flour, 1 cup butter, 1.5 cups sugar, 3 lemons; 190 calories and 2 grams of protein a serving; $0.45 a serving; added January 17, 2026.](images/card-3-lemon-bars.png)

- American · dessert · 50 minutes · serves 16 · vegetarian · rated 4.8
- Tags: sweet, bake-sale
- Ingredients: 2 cups flour · 1 cup butter · 1.5 cups sugar · 3 lemons
- Per serving: 190 calories, 2 g protein · costs $0.45
- Added January 17, 2026

### Card 4: Chickpea Curry

![Card 4, Chickpea Curry, handwritten on a lined index card: Indian, dinner, 35 minutes, serves 4, vegetarian, rated 4.7; tags vegan and spicy; 2 cans chickpeas, 1 can coconut milk, 1 onion, 2 tablespoons curry powder; 380 calories and 14 grams of protein a serving; $1.75 a serving; added January 20, 2026.](images/card-4-chickpea-curry.png)

- Indian · dinner · 35 minutes · serves 4 · vegetarian · rated 4.7
- Tags: vegan, spicy
- Ingredients: 2 cans chickpeas · 1 can coconut milk · 1 onion · 2 tablespoons curry powder
- Per serving: 380 calories, 14 g protein · costs $1.75
- Added January 20, 2026

The comment above each function in `queries.js` turns its card into exact field names and values: `minutes` 45, `vegetarian` false, each ingredient's `unit` as one word (`"pound"`, `"can"`, `"cup"`, `"tablespoon"`, or `"whole"` for things you count, like lemons and onions), and so on. Follow the comment, and card 1's shape in `data/cards.json`.

## Before you start

In VS Code's terminal, in this folder, install the packages the tests use (once):

```bash
npm install
```

## Try it in mongosh

Every answer is one `insertOne`, so you can try it at the mongosh prompt before you paste it in. Start mongosh in this folder, choose a practice database, and load card 1:

```bash
mongosh
```

```mongodb
use recipe_cards
load("data/load-into-mongosh.js")
```

It prints `cards: 1 documents`, then `true`. Type `db.cards.find()` to see card 1, try your `insertOne`, and `find` again to see your card beside it. Running the load file again empties the collection back to card 1. Type `exit` when you're done.

## Check your work

```bash
npm test
```

At first every test fails: that is expected. There are two tests per card: one for its text, numbers, true or false, money and date, and one for its tags, ingredients and nutrition. A failing test's message says which field is wrong and why, for example *1) Weeknight Chili: minutes should be a number, 45, but it's text: "45". Take the quotes off a number.*

The tests start their own throwaway MongoDB, so they never touch your databases. If you installed MongoDB on your computer in the course's setup lesson, the tests use it. If you didn't, the first `npm test` downloads MongoDB 9.0.8 for the tests (nearly 1 GB on Windows, about 180 MB on a Mac) and keeps it for every exercise after this one.

## The rules

- Write one `insertOne` in each function, after the word `return`, keeping the `_id` and name it starts with.
- Add exactly the fields the comment lists, spelled as card 1 spells them, and no others.
- Text in quotes; numbers and `true` or `false` without; lists in square brackets, in the card's order; the nutrition box as a document in braces; money with `NumberDecimal("...")`; dates with `ISODate("...")`.

## Tips

- Copy card 1's shape from `data/cards.json` and change the values. In that file, `{"$numberDecimal": "0.85"}` is how a JSON file writes `NumberDecimal("0.85")`, and `{"$date": ...}` is how it writes a date.
- Write one card a line at a time, indented like the lessons' Saturday Pancakes card, so a missing comma or bracket is quick to spot.
- `"45"` with quotes is text. The tests check the type of every value, not only how it looks.
- Fix the first message a test prints, run `npm test` again, and repeat: each run points at the next field to fix.

## Hand it in

When it works, push your solution to a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. The lesson page shows the Git commands, step by step.
