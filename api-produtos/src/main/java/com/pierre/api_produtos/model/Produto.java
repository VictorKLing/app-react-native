package com.pierre.api_produtos.model;

public class Produto {
    private Long id;
    private String nome;
    private int qtdDisponivel;

    public Produto(){}

    public Produto(Long id, String nome, int qtdDisponivel) {
        this.id = id;
        this.nome = nome;
        this.qtdDisponivel = qtdDisponivel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getQtdDisponivel() {
        return qtdDisponivel;
    }

    public void setQtdDisponivel(int qtdDisponivel) {
        this.qtdDisponivel = qtdDisponivel;
    }
}
