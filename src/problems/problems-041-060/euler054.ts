import pokerText from './assets/p054_poker.txt?raw';

import { max, min, sum } from '../maths.js';
import {
  arraysEqual,
  concat,
  haveDuplicates,
  nbOccurrences,
  range,
  uniq,
} from '../utils.js';

enum HandValues {
  HighCard, // 0
  OnePair, // 1
  TwoPairs, // 2
  ThreeOfAKind, // 3
  Straigh, // 4
  Flush, // 5
  FullHouse, // 6
  FourOfAKind, // 7
  StraightFlush, // 8
  RoyalFlush, // 9
}

interface HandValue {
  round1: number;
  round2: number | null;
  round3: number | null;
}

/*
https://projecteuler.net/problem=54
*/
export function euler054(): number {
  const hands = pokerText
    .split('\n')
    .filter((line) => line)
    .map((game) => {
      const cards = game.split(' ');
      return [cards.slice(0, 5), cards.slice(5, 10)] as const;
    });

  function cardValue(card: string): number {
    const value = card.charAt(0);
    if (value === 'A') {
      return 14; // Ace
    } else if (value === 'K') {
      return 13; // King
    } else if (value === 'Q') {
      return 12; // Queen
    } else if (value === 'J') {
      return 11; // Jack
    } else if (value === 'T') {
      return 10; // Ten
    } else {
      return +value;
    }
  }

  function handValue(hand: string[]): HandValue {
    const cardValues = hand.map((card) => cardValue(card)).sort();

    const pairs = uniq(
      cardValues.filter((val) => nbOccurrences(val, cardValues) === 2),
    );
    const three =
      cardValues.filter((val) => nbOccurrences(val, cardValues) === 3)[0] ||
      null;
    const four =
      cardValues.filter((val) => nbOccurrences(val, cardValues) === 4)[0] ||
      null;
    const handCards = concat(pairs, [three, four]);
    const other = cardValues.filter((c) => !handCards.includes(c));

    if (pairs.length === 1 && three) {
      return {
        round1: HandValues.FullHouse,
        round2: three,
        round3: pairs[0]!,
      };
    } else if (three) {
      return {
        round1: HandValues.ThreeOfAKind,
        round2: three,
        round3: max(other),
      };
    } else if (four) {
      return {
        round1: HandValues.FourOfAKind,
        round2: four,
        round3: max(other),
      };
    } else {
      if (pairs.length === 2) {
        return {
          round1: HandValues.TwoPairs,
          round2: sum(pairs),
          round3: max(other),
        };
      } else if (pairs.length === 1) {
        return {
          round1: HandValues.OnePair,
          round2: pairs[0]!,
          round3: max(other),
        };
      }
    }

    const cardSuits = hand.map((card) => card[1]).sort();

    const isStraight = arraysEqual(
      cardValues,
      range(min(cardValues), max(cardValues) + 1),
    );
    const isFlush = !haveDuplicates(cardSuits);

    if (isStraight && isFlush) {
      if (cardValues.includes(14)) {
        return {
          round1: HandValues.RoyalFlush,
          round2: null,
          round3: null,
        };
      } else {
        return {
          round1: HandValues.StraightFlush,
          round2: max(cardValues),
          round3: null,
        };
      }
    }

    if (isStraight) {
      return {
        round1: HandValues.Straigh,
        round2: max(cardValues),
        round3: null,
      };
    }

    if (isFlush) {
      return {
        round1: HandValues.Flush,
        round2: max(cardValues),
        round3: null,
      };
    }

    return {
      round1: HandValues.HighCard,
      round2: max(cardValues),
      round3: max(cardValues.filter((c) => c !== max(cardValues))),
    };
  }

  let playerOneWins = 0;
  for (const [hand1, hand2] of hands) {
    const value1 = handValue(hand1);
    const value2 = handValue(hand2);

    if (value1.round1 > value2.round1) {
      playerOneWins += 1;
    } else if (value1.round1 === value2.round1) {
      if (value1.round2 == null || value2.round2 == null) {
        continue;
      }
      if (value1.round2 > value2.round2) {
        playerOneWins += 1;
      } else if (value1.round2 === value2.round2) {
        if (value1.round3 == null || value2.round3 == null) {
          continue;
        }
        if (value1.round3 > value2.round3) {
          playerOneWins += 1;
        }
      }
    }
  }

  return playerOneWins;
}
