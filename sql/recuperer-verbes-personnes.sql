-- table temporaire pour les verbes que je vais retenir
create temp table verbes (mot text);

\copy verbes from '../liste-verbes/ALL'

create temp table verbes_morph as
select
    m mot,
    l.id as lemme,
    f.j ->> 'Number' as number,
    f.j ->> 'Person' as person,
    f.j ->> 'VerbForm' as verbform
from mot m
join lexeme x on x.id = m.lexeme
join lemme l on l.id = x.lemme
join verbes v on v.mot = l.graphie
join morph f on f.id = x.morph;

-- une table pour store les résultat aggrégés (morphologie des verbes
-- et morphologie des auxiliaires).
create temp table result as 
select
v.lemme, v.number, v.person, v.verbform
from verbes_morph v
where v.number is not null and v.person is not null;

-- j'essaie de récupérer les informations des auxiliaires.
create temp table _verb as
select
    v.lemme,
    v.person,
    v.number,
    v.verbform,
    (v.mot).*
from verbes_morph v
where v.person is null or v.number is null;

-- des indexes pour rapidifier les join/where
create index on _verb(lemme);
create index on _verb(person);
create index on _verb(number);
create index on _verb(lexeme);
create index on _verb(num);
create index on _verb(noyau);
create index on _verb(texte);

-- une table pour store les auxiliaires
create temp table aux as 
select
    v.lemme,
    x.morph
from _verb v
join mot m on v.texte = m.texte and v.num = m.noyau
join lexeme x on m.lexeme = x.id
join nature n on n.id = x.nature
join fonction f on f.id = m.fonction
where (n.nom in ('aux', 'verb') or f.nom like 'aux:%') ;

-- ajouter les morphologies des auxilaires dans la table quasi-finale
-- (les auxiliaires récupérées ainsi sont plus nombreuses que les verbes)
insert into result
select
    a.lemme,
    h.j ->> 'Number' as number,
    h.j ->> 'Person' as person,
    h.j ->> 'VerbForm' as verbform
from aux a join morph h on h.id = a.morph;

-- des indexes pour accélerer la suite
create index on result(number);
create index on result(person);
create index on result(lemme);

create temp table person_number (
    lemme int primary key,
    verb text unique,
    sing int,
    plur int,
    first int,
    second int,
    third int
);

insert into person_number (lemme)
select distinct lemme from result;

update person_number p
set sing =
  (select count(*)
   from person_number
   join result l on l.lemme = p.lemme
   and l.number = 'Sing');

update person_number p
set plur =
  (select count(*)
   from person_number
   join result l on l.lemme = p.lemme
   and l.number = 'Plur');

update person_number p
set first =
  (select count(*)
   from person_number
   join result l on l.lemme = p.lemme
   and l.person = '1');

update person_number p
set second =
  (select count(*)
   from person_number
   join result l on l.lemme = p.lemme
   and l.person = '2');

update person_number p
set third =
  (select count(*)
   from person_number
   join result l on l.lemme = p.lemme
   and l.person = '3');

update person_number p
set verb = l.graphie
from lemme l where l.id = p.lemme;

\copy (select jsonb_agg(to_jsonb(p) - 'lemme') from person_number p) to 'verbes_personnes_nombres.json';

\copy (select p.verb, p.sing, p.plur, p.first, p.second, p.third from person_number p) to 'verbes_personnes_nombres.csv' csv HEADER;
