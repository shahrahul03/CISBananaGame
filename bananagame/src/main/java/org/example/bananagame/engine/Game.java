package org.example.bananagame.engine;

public class Game {
    private String imageBase64;
    private int solution;

    public Game(String imageBase64, int solution) {
        this.imageBase64 = imageBase64;
        this.solution = solution;
    }

    // Getters
    public String getImageBase64() {
        return imageBase64;
    }

    public int getSolution() {
        return solution;
    }
}
