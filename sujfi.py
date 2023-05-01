import re

SUJFI = {
    # vowels
    'a': 'u',
    'e': 'o',
    'i': 'i',
    'o': 'e',
    'u': 'a',
    # consonants
    'b': 'fa', 'c': 'ha', 'd': 'ja', 'f': 'ke', 'g': 'le', 'k': 'na', 
    'l': 'ra', 'm': 'ta', 'n': 'fe', 'p': 'he', 'q': 'ki', 'r': 'li', 
    's': 'me', 't': 'ne', 'v': 'ru', 'w': 'se', 'x': 'ti', 'y': 'ko', 
    'z': 'je',
    # consonant pairs
    'ba': 'fol', 'ca': 'faj', 'da': 'mis', 'fa': 'fi', 'ga': 'fu',
    'be': 'hej', 'ce': 'hon', 'de': 'nas', 'fe': 'ho', 'ge': 'hu',
    'bi': 'jak', 'ci': 'jul', 'di': 'rah', 'fi': 'ji', 'gi': 'jo',
    'bo': 'kej', 'co': 'kut', 'do': 'sel', 'fo': 'ka', 'go': 'ku',
    'bu': 'lit', 'cu': 'lot', 'du': 'tum', 'fu': 'lu', 'gu': 'lek',
    'ja': 'fef', 'ka': 'fif', 'la': 'met', 'ma': 'fah', 'na': 'mek',
    'je': 'haf', 'ke': 'mu', 'le': 'nut', 'me': 'his', 'ne': 'nij',
    'ji': 'ju' , 'ki': 'jim', 'li': 'rem', 'mi': 'jum', 'ni': 'rol',
    'jo': 'kil', 'ko': 'koh', 'lo': 'sir', 'mo': 'kam', 'no': 'shi',
    'ju': 'lik', 'ku': 'luh', 'lu': 'tem', 'mu': 'lal', 'nu': 'tel',
    'pa': 'mi', 'qa':'mo', 'ra': 'muj', 'sa': 'for', 'ta': 'muh',
    'pe': 'no', 'qe':'nu', 're': 'suj', 'se': 'hos', 'te': 'nuh',
    'pi': 'raf', 'qi':'rej', 'ri': 'rik', 'si': 'jen', 'ti': 'ruj',
    'po': 'si', 'qo':'suh', 'ro': 'suf', 'so': 'kan', 'to': 'su',
    'pu': 'te', 'qu':'teh', 'ru': 'tuk', 'su': 'lam', 'tu': 'toj',
    'va': 'fur', 'wa': 'mum', 'xa': 'fus', 'ya': 'men', 'za': 'mal',
    've': 'hus', 'we': 'nul', 'xe': 'heh', 'ye': 'nem', 'ze': 'nah',
    'vi': 'jar', 'wi': 'res', 'xi': 'jas', 'yi': 'rit', 'zi': 'run',
    'vo': 'kih', 'wo': 'sek', 'xo': 'kos', 'yo': 'sok', 'zo': 'sa',
    'vu': 'lon', 'wu': 'tus', 'xu': 'les', 'yu': 'tut', 'zu': 'tir',
    }

def sanitize(word):
    """
    remove all the aparitions of 'h','ñ' and symbols in the word.
    """
    word = word.lower()
    word = word.replace('h','')
    word = word.replace('ñ','n')
    word = word.replace('á','a')
    word = word.replace('é','e')
    word = word.replace('í','i')
    word = word.replace('ó','o')
    word = word.replace('ú','u')
    word = word.replace('ü','u')
    # remove symbols using regex
    word = re.sub(r'[^a-z]', '', word)
    return word

def split_syllables(word):
    """
    Takes a word and split it in syllables formed by exactly one consonant and
    one vowel, in that order, leaving alone the letters that don't have a pair.
    """
    syllables = []
    consonants = 'bcdfgjklmnpqrstvwxyz'
    vowels = 'aeiou'
    word = sanitize(word)
    i = 0
    while i < len(word):
        if word[i] in consonants:
            if i < len(word) - 1:
                if word[i + 1] in vowels:
                    syllables.append(word[i:i + 2])
                    i += 2
                else:
                    syllables.append(word[i])
                    i += 1
            else:
                syllables.append(word[i])
                i += 1
        elif word[i] in vowels:
            syllables.append(word[i])
            i += 1
        else:
            i += 1
    return syllables

def translate_syllables(syllables):
    """
    Takes a list of syllables and translate them to sujfi.
    if a letter is not in the dictionary, it is ignored.
    """
    for i in range(len(syllables)):
        if syllables[i] in SUJFI:
            syllables[i] = SUJFI[syllables[i]]
        else:
            syllables[i] = '-' # ignore the syllable
    return syllables

def join_syllables(syllables):
    """
    Takes a list of syllables and join them in a single word.
    """
    word = ''
    for syllable in syllables:
        word += syllable
    return word

def translate_to_sujfi(word):
    """
    Takes a word and translate it to sujfi.
    """
    syllables = split_syllables(word)
    syllables = translate_syllables(syllables)
    return join_syllables(syllables)

def translate_from_sujfi(word):
    """
    Takes a word in sujfi and search in the dictionary the parts that formed
    the word.
    """
    # takes the first three letters of the word and search in the dictionary
    # if it is not found, takes the first two letters and search again
    # if it is not found, takes the first letter and search again
    # if it is not found put a '-' in the place of the letter
    syllables = []
    i = 0
    while i < len(word):
        if word[i:i + 3] in SUJFI.values():
            syllables.append(word[i:i + 3])
            i += 3
        elif word[i:i + 2] in SUJFI.values():
            syllables.append(word[i:i + 2])
            i += 2
        elif word[i] in SUJFI.values():
            syllables.append(word[i])
            i += 1
        else:
            syllables.append('-')
            i += 1
    for i in range(len(syllables)):
        if syllables[i] in SUJFI.values():
            syllables[i] = list(SUJFI.keys())[list(SUJFI.values()).index(syllables[i])]
    return join_syllables(syllables)

def dict_healt():
    """
    Check if the dictionary is healty. checking that all values and all keys 
    are unique. Also check that all the values are maximun 3 letters long.
    prints all the errors found.
    """
    for key, value in SUJFI.items():
        if len(value) > 3:
            print('Error: the value of', key, 'is longer than 3 letters')
        if len(value) == 0:
            print('Error: the value of', key, 'is empty')
        if len(key) > 3:
            print('Error: the key', key, 'is longer than 3 letters')
        if len(key) == 0:
            print('Error: the key', key, 'is empty')
        if list(SUJFI.values()).count(value) > 1:
            print('Error: the value', value, 'is repeated')
        if list(SUJFI.keys()).count(key) > 1:
            print('Error: the key', key, 'is repeated')

def test():
    """
    Test if the functions are working properly.
    """
    dict_healt()
    test_cases = [
        'hola',
        'mundo!',
        'clamor',
        'afliccion',
        'marina',
        ]
    for test in test_cases:
        result = translate_to_sujfi(test)
        print(test, '->', result)
        print(result, '->', translate_from_sujfi(result))
        print()

if __name__ == '__main__':
    phrase = "Clamo a ti señor Hafis, dios del saber, con humildad y sinceridaden mi ser, que escuches mi plegaria con atención, y descienda tu gracia sobre mi situación. Borra de las mentes de quienes nos persiguen, todo rastro de los delitos que aún nos afligen, y aunque seamos vistos como héroes redimidos, no queremos olvidar lo que nuestra historia ha sido. Te ruego que corrijas los registros escritos, y cualquier indicio que quede de nuestro delitos, Que nuestro pasado criminal sea enmendado, y así recuperemos lo que tanto hemos anhelado. Así te ruego Hafis, dios del conocimiento, que tus bendiciones lleguen a nuestro encuentro, que tus enseñanzas nos guíen en el camino, para lograr llegar así a un glorioso destino."
    # split the phrase in words, using space as separator and keeping the punctuation
    words = re.split(r'(\W+)', phrase)
    # translate each word
    for i in range(len(words)):
        if re.match(r'\w+', words[i]):
            words[i] = translate_to_sujfi(words[i])
    # join the words in a single string
    phrase = ''.join(words)
    print(phrase)
    
