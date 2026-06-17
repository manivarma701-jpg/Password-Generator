/*
 * ============================================================
 *  PASSWORD GENERATOR - Java (Swing GUI)
 *  Frontend + Backend combined
 * ============================================================
 *  Lines of Code: ~165
 *  Compile: javac PasswordGenerator.java && java PasswordGenerator
 * ============================================================
 */
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.security.SecureRandom;

public class PasswordGenerator extends JFrame {

    private JSpinner lengthSpinner;
    private JCheckBox upperBox, digitBox, symbolBox;
    private JTextField outputField;
    private JLabel strengthLabel;
    private JProgressBar strengthBar;

    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGIT = "0123456789";
    private static final String SYMBOL = "!@#$%^&*()-_=+[]{};:,.<>/?";
    private final SecureRandom random = new SecureRandom();

    public PasswordGenerator() {
        setTitle("Password Generator");
        setSize(500, 350);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        getRootPane().setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        buildUI();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    private void buildUI() {
        // --- Top: Controls ---
        JPanel top = new JPanel(new GridLayout(4, 2, 5, 5));

        top.add(new JLabel("Password Length:"));
        lengthSpinner = new JSpinner(new SpinnerNumberModel(12, 4, 64, 1));
        top.add(lengthSpinner);

        upperBox  = new JCheckBox("Uppercase (A-Z)", true);
        digitBox  = new JCheckBox("Digits (0-9)", true);
        symbolBox = new JCheckBox("Symbols (!@#)", true);
        top.add(upperBox);  top.add(new JLabel(""));
        top.add(digitBox);  top.add(symbolBox);

        JButton generateBtn = new JButton("Generate Password");
        generateBtn.setBackground(new Color(70, 130, 180));
        generateBtn.setForeground(Color.WHITE);
        generateBtn.setFont(new Font("Arial", Font.BOLD, 14));
        generateBtn.addActionListener(e -> generate());
        top.add(generateBtn);

        add(top, BorderLayout.NORTH);

        // --- Center: Output ---
        JPanel center = new JPanel(new BorderLayout(5, 5));
        outputField = new JTextField();
        outputField.setFont(new Font("Monospaced", Font.BOLD, 16));
        outputField.setEditable(false);
        center.add(new JLabel("Generated Password:"), BorderLayout.NORTH);
        center.add(outputField, BorderLayout.CENTER);

        JButton copyBtn = new JButton("Copy");
        copyBtn.addActionListener(e -> {
            outputField.selectAll();
            outputField.copy();
            JOptionPane.showMessageDialog(this, "Copied!");
        });
        center.add(copyBtn, BorderLayout.EAST);

        add(center, BorderLayout.CENTER);

        // --- Bottom: Strength ---
        JPanel bottom = new JPanel(new BorderLayout());
        strengthLabel = new JLabel("Strength: ");
        strengthBar   = new JProgressBar(0, 5);
        strengthBar.setStringPainted(true);
        bottom.add(strengthLabel, BorderLayout.WEST);
        bottom.add(strengthBar,  BorderLayout.CENTER);
        add(bottom, BorderLayout.SOUTH);
    }

    private void generate() {
        int length = (int) lengthSpinner.getValue();
        StringBuilder pool = new StringBuilder(LOWER);
        if (upperBox.isSelected())  pool.append(UPPER);
        if (digitBox.isSelected())  pool.append(DIGIT);
        if (symbolBox.isSelected()) pool.append(SYMBOL);

        StringBuilder pwd = new StringBuilder();
        for (int i = 0; i < length; i++)
            pwd.append(pool.charAt(random.nextInt(pool.length())));

        outputField.setText(pwd.toString());
        int score = strength(pwd.toString());
        strengthBar.setValue(score);
        strengthLabel.setText("Strength: " + label(score));
        strengthBar.setForeground(colorForScore(score));
    }

    private int strength(String p) {
        int s = 0;
        if (p.length() >= 8)  s++;
        if (p.length() >= 12) s++;
        if (p.matches(".*[A-Z].*")) s++;
        if (p.matches(".*[0-9].*")) s++;
        if (p.matches(".*[!@#$%^&*()].* ")) s++;
        return s;
    }

    private String label(int s) {
        return switch (s) {
            case 0, 1 -> "VERY WEAK";
            case 2, 3 -> "MODERATE";
            case 4    -> "STRONG";
            default   -> "VERY STRONG";
        };
    }

    private Color colorForScore(int s) {
        return switch (s) {
            case 0, 1 -> Color.RED;
            case 2, 3 -> Color.ORANGE;
            case 4    -> new Color(50, 200, 50);
            default   -> new Color(0, 150, 0);
        };
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(PasswordGenerator::new);
    }
}
