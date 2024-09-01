-- le script pour récupérer les cooccurrences les plus fréquentes avec
-- lire et écrire

create temp table verbe as
select
    x2.lemme as lemme,
    l1.id as lire_ecrire
from mot m1
join mot m2 on m1.texte = m2.texte
    and m1.phrase = m2.phrase
    and m1.num != m2.num
join lexeme x1 on x1.id = m1.lexeme
join lexeme x2 on x2.id = m2.lexeme
join lemme l1 on l1.id = x1.lemme
join lemme l2 on l2.id = x2.lemme
join nature n on n.id = x2.nature
where l1.graphie in ('lire', 'écrire')
and l2.graphie not in (select lemme from stopword)
and n.nom = 'verb';

create temp table verbe_count as
with verbe_count as (
    select
        lemme,
        lire_ecrire,
        count(*)
    from verbe
    group by lemme, lire_ecrire
), occurrence as (
    select v.lemme, count(m.*) from verbe_count v
    join lexeme x on x.lemme = v.lemme
    join mot m on m.lexeme = x.id
    group by v.lemme
)
select
    l.graphie as verbe,
    l2.graphie as lire_ecrire,
    v.count as cooccurrence,
    o.count as occurrence,
    o.count / v.count as part_cooccurrence
from verbe_count v
join occurrence o on o.lemme = v.lemme
join lemme l on l.id = v.lemme
join lemme l2 on l2.id = v.lire_ecrire
order by cooccurrence;

create temp table lire as
select verbe,
       cooccurrence,
       part_cooccurrence
from verbe_count
where lire_ecrire = 'lire';

create temp table ecrire as
select verbe,
       cooccurrence,
       part_cooccurrence
from verbe_count
where lire_ecrire = 'écrire';

\copy (select verbe, cooccurrence from lire order by cooccurrence desc limit 15) to 'lire.csv' csv header;

\copy (select verbe, cooccurrence from ecrire order by cooccurrence desc limit 15) to 'ecrire.csv' csv header;
