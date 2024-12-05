package org.example.bananagame;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.example.bananagame.engine.Game;
import org.example.bananagame.engine.GameServer;

@Path("/game")
public class HelloResource {
    private GameServer gameServer = new GameServer();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Game getGame() {
        return gameServer.getRandomGame();
    }
}
