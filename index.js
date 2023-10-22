const express = require('express');
const server = express();
const apicache = require('apicache');

const resultados = {
    pessoas: [{id:1, nome: "Marcelo"}, {id:2, nome: "João"}, {id:3, nome: "Maria"}],
    carros: [{id:1, modelo: "Fusca"}, {id:2, modelo: "Gol"}, {id:3, modelo: "Palio"}],
    animais: [{id:1, nome: "Cachorro"}, {id:2, nome: "Gato"}, {id:3, nome: "Papagaio"}]
};


let cache = apicache.middleware;

server.get('/teste/:tipo/:id?', cache('5 minutes'), (req, res) => {
    const tipo = req.params.tipo; 
    const id = parseInt(req.params.id); 
  
    if(id){

        const lista = resultados[tipo];
        var response = null;

        for(let i = 0; i < lista.length; i++) {
            if (lista[i].id === id) {
              response = lista[i];
              break;
            }
        }  

        if(response){
            
            cache.tipo = tipo; // Atualiza o tipo no cache
            cache.id = id;
            return res.json(response);
            
        } else {
            return res.status(404).json({ mensagem: 'ID não encontrado' });
        }
        
    }else{
        if(resultados[tipo]){
            
            cache.tipo = tipo; // Atualiza o tipo no cache
            delete cache.id;
            return res.json(resultados[tipo]);

        }else{
            return res.status(404).json({ mensagem: 'lista não encontrada' });
        }
        
    }
    
});

server.listen(3000, () => {
    console.log('servidor funcionando...');
});