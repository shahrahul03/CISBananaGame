package org.example.bananagame;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
public class AuthResource {
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response authenticateUser(UserModel credentials) {
        if ("user".equals(credentials.getUsername()) && "password".equals(credentials.getPassword())) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}
