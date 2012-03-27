
exports.croc = function(){

/*
 * Extrait du contrat les caractéristique intéressante pour l'estimation.
 * @api private
 */
function carac (c){
  return {'sadism':c.sadism,'ugliness':c.ugliness,'power':c.power,'greediness':c.greediness};
}

/* Extrait du contrat les caractéristique intéressante pour l'estimation.
 * 95 + 5 x ([compétence du monstre] - [compétence requise]) - difficulté
 * source : http://www.twinpedia.com/croquemonster/contrats
 * @api private
 */
function estimateSimple (m, c) {
    // Le sadisme
    // 95 + 5 x ([compétence du monstre] - [compétence requise]) - difficulté
    var defaultEst = 5;
    var result = 1;
    for (var carac in m) {
        if (m[carac] > 0) {
            var est = Math.min(100, 95 + (5 * (m[carac] - c[carac]) - c.difficulty + defaultEst));
            result *= est;
        } else {
            result *= defaultEst;
        }
    }
    return result / 1000000;
}


return {
    /* Le pourcentage de réussite pour chaque compétence est donné par :
     * 
     * <pre>
     * 95 + 5 x ([compétence du monstre] - [compétence requise]) - difficulté
     * </pre>
     * 
     * Si le monstre a 0 dans la compétence, le pourcentage de réussite est de
     * 5%.
     * 
     * Exemple : un contrat demande 4 de sadisme, votre monstre en a 5 et la
     * difficulté est de 10. Le pourcentage est alors de 90%.
     * 
     * La difficulté est un coefficient calculé on ne sait pas trop comment.
     * Elle est visible quand on récupère les données du contrat via l'API,
     * sinon on a le pourcentage directement ! Donc cela ne veut pas toujours
     * dire grand chose qu'un contrat demande "x en sadisme", mieux vaut se fier au pourcentage donné.
     * @param {Montre} m le monstre considéré.
     * @param {Contract} c le contrat à évaluer.
     * @api public
     */
    estimate: function(m, c) {
        var estimate = estimateSimple(carac(m), c);
        // controle :
        // 100 + 5 x ([contrôle du monstre] - k x [gourmandise du monstre])
        if (c.greediness == 0) {
            var k = 1;
            switch (parseInt(c.kind)) {
              case 3:
	                k = 2;
	                break;
              case 2:
	                k = 1.5;
	                break;
              case 1:
	                k = 1;
	                break;
            }
            var control = (100 + 5 * (m.control - k * m.greediness));
            return estimate * control / 100;

        }
        return estimate;
    }

} }();
