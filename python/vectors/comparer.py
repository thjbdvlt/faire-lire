from gensim.models import KeyedVectors
import orjson

# ce script est fourni de façon purement indicative, puisque les modèles
# utilisé ne sont pas dans le repository.
fp = "../../models/vectors_lemmas.bin"
fp_forum = "../../models/vectors_forum.bin"

vec = KeyedVectors.load_word2vec_format(fp, binary=True)
vec_forum = KeyedVectors.load_word2vec_format(fp_forum, binary=True)

path_data = "../liste-verbes/ALL"
with open(path_data, 'r') as f:
    verbes = f.readlines()

verbes = [i.strip() for i in verbes]
verbes = [i for i in verbes if i != ""]
verbes = set(verbes)

for pair in [("lire", "écrire"), ("produire", "consommer"), ("fabriquer", "utiliser")]:
    d = []
    for i in verbes:
        if i in vec and i in vec_forum:
            x = {"mot": i}
            for vname, v in (("forum", vec_forum), ("générique", vec)):
                x[vname] = {}
                for mot in pair:
                    x[vname][mot] = float(round(v.similarity(mot, i), 3))
            d.append(x)

    with open(f"../../data/vectors/verbes_similarite_{pair[0]}_{pair[1]}.json", 'bw') as f:
        f.write(orjson.dumps(d))
