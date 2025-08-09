import java.util.Scanner;

// Interface 1 for Rectangle
interface Rectangle {
    double calculateRectangleArea(double length, double width);
}

// Interface 2 for Triangle
interface Triangle {
    double calculateTriangleArea(double base, double height);
}

// Class that implements both interfaces
class AreaCalculator implements Rectangle, Triangle {

    public double calculateRectangleArea(double length, double width) {
        return length * width;
    }

    public double calculateTriangleArea(double base, double height) {
        return 0.5 * base * height;
    }
}

public class Main8 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);  // simplified from 'scanner' to 'sc'
        AreaCalculator calculator = new AreaCalculator();

        // Rectangle input
        System.out.print("Enter length of Rectangle: ");
        double length = sc.nextDouble();
        System.out.print("Enter width of Rectangle: ");
        double width = sc.nextDouble();
        System.out.println("Area of Rectangle: " + calculator.calculateRectangleArea(length, width));

        // Triangle input
        System.out.print("\nEnter base of Triangle: ");
        double base = sc.nextDouble();
        System.out.print("Enter height of Triangle: ");
        double height = sc.nextDouble();
        System.out.println("Area of Triangle: " + calculator.calculateTriangleArea(base, height));

        sc.close();
    }
}
