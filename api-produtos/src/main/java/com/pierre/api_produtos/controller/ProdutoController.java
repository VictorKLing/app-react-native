package com.pierre.api_produtos.controller;

import com.pierre.api_produtos.model.Produto;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/produtos")
public class ProdutoController {
    private List<Produto> produtos = new ArrayList<>();
    private long proximoId = 1;

    @PostMapping
    public Produto cadastrarProduto(@RequestBody Produto produto) {
        produto.setId(proximoId);
        this.proximoId++;
        produtos.add(produto);
        return produto;
    }

    @GetMapping
    public List<Produto> listarProdutos() {
        return produtos;
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable("id") Long id) {
        for (Produto produto : produtos) {
            if (produto.getId().equals(id)) {
                return produto;
            }
        }
        return null;
    }

    @PutMapping("/{id}")
    public Produto atualizarEstoque(@PathVariable("id") Long id,@RequestBody Produto produtoAtualizado) {
        for (Produto produto : produtos) {
            if (produto.getId().equals(id)) {
                produto.setQtdDisponivel(produtoAtualizado.getQtdDisponivel());
                return produto;
            }
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public Produto deletarProduto(@PathVariable("id") Long id) {
        for (int i = 0; i < produtos.size(); i++) {
            Produto produto = produtos.get(i);

            if (produto.getId().equals(id)) {
                produtos.remove(i);
                return produto;
            }
        }
        return null;
    }

    @GetMapping("/{id}/quantidade")
    public Integer verificarQuantidade(@PathVariable("id") Long id) {
        for (Produto produto : produtos) {
            if (produto.getId().equals(id)) {
                return produto.getQtdDisponivel();
            }
        }
        return null;
    }

}
