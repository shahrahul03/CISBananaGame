package org.example.bananagame.engine;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Base64;
import javax.imageio.ImageIO;

public class GameServer {
    private static String readUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            InputStream inputStream = url.openStream();
            ByteArrayOutputStream result = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                result.write(buffer, 0, length);
            }
            return result.toString("UTF-8");
        } catch (Exception e) {
            System.out.println("An error occurred: " + e);
            return null;
        }
    }

    public Game getRandomGame() {
        String bananaApi = "https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes";
        String dataRaw = readUrl(bananaApi);
        String[] data = dataRaw.split(",");
        byte[] decodedImg = Base64.getDecoder().decode(data[0]);
        int solution = Integer.parseInt(data[1]);

        String imageBase64 = Base64.getEncoder().encodeToString(decodedImg);
        return new Game(imageBase64, solution);
    }
}
