import java.util.Scanner;

// Outer class (not public)
class Outer {
    private String privateMessage;
    String defaultMessage;
    protected String protectedMessage;
    public String publicMessage;

    // Method to take user input
    public void getInput() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter private message: ");
        privateMessage = scanner.nextLine();

        System.out.print("Enter default message: ");
        defaultMessage = scanner.nextLine();

        System.out.print("Enter protected message: ");
        protectedMessage = scanner.nextLine();

        System.out.print("Enter public message: ");
        publicMessage = scanner.nextLine();
    }

    // Inner class
    class Inner {
        void displayMessages() {
            System.out.println("\n--- Inside Inner Class ---");
            System.out.println("Private: " + privateMessage);
            System.out.println("Default: " + defaultMessage);
            System.out.println("Protected: " + protectedMessage);
            System.out.println("Public: " + publicMessage);
        }
    }
}

// Main class
public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.getInput(); // Take user input

        // Create and use inner class
        Outer.Inner inner = outer.new Inner();
        inner.displayMessages();

        System.out.println("\n--- Accessing from Main class ---");
        // System.out.println("Private: " + outer.privateMessage); // ❌ Error: private access
        System.out.println("Default: " + outer.defaultMessage);     // ✅
        System.out.println("Protected: " + outer.protectedMessage); // ✅
        System.out.println("Public: " + outer.publicMessage);       // ✅
    }
}
