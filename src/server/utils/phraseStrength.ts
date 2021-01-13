// return a number that represents the new strength
export const updatePhraseStrength = (newStrikes: number, strength: number, change: 1 | -1): number => {

    /*
        the strength changes according to 3 factors:
        1. If the result is positive, meaning a correct answer
        2. The current strength
        3. The current strikes

        There are 3 possiblities: Strength goes up, down, or stays the same

    */

   let positive = change > 0;

    switch(true) {
        case (strength === 5):
            if( newStrikes < 2 || positive ) return 5;
            return 4;
        case (strength === 4):
            if( newStrikes < 2 && positive ) return 5;
            if( newStrikes > 3 ) return 3;
            return 4;
        case (strength === 3):
            if( newStrikes < 4 && positive ) return 4;
            if( newStrikes > 6 ) return 2;
            return 3;
        case (strength === 2):
            if( newStrikes < 7 && positive) return 3;
            if( newStrikes > 10 ) return 1;
            return 2;
        default:
            if( newStrikes < 11 && positive ) return 2;
            return 1;
    }
}