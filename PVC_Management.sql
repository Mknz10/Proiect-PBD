-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 09, 2025 at 07:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `PVC_Management`
--

-- --------------------------------------------------------

--
-- Table structure for table `Clienti`
--

CREATE TABLE `Clienti` (
  `ID_Client` int(11) NOT NULL,
  `Nume` varchar(100) NOT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Telefon` varchar(15) DEFAULT NULL,
  `Adresa` text DEFAULT NULL,
  `Tip_Client` enum('fizic','juridic') NOT NULL,
  `Data_Inregistrare` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Clienti`
--

INSERT INTO `Clienti` (`ID_Client`, `Nume`, `Email`, `Telefon`, `Adresa`, `Tip_Client`, `Data_Inregistrare`) VALUES
(1, 'Ion Popescu', 'ion.popescu@gmail.com', '0723456789', 'Str. Principală, Nr. 10', 'fizic', '2023-05-09 21:00:00'),
(2, 'SC Ferestre SRL', 'office@ferestre.ro', '0211234567', 'Bd. Unirii, Nr. 20', 'juridic', '2022-11-14 22:00:00'),
(3, 'Maria Ionescu', 'maria.ionescu@yahoo.com', '0741122334', 'Str. Libertății, Nr. 5', 'fizic', '2024-01-02 22:00:00'),
(4, 'Lucian Petre', 'lucian.petre@gmail.com', '0712345678', 'Str. Muncii, nr. 8', 'fizic', '2024-12-13 22:00:00'),
(5, 'Petru Pop', 'petru.pop@gmail.com', '0734166645', NULL, 'fizic', '2025-01-03 11:29:48');

-- --------------------------------------------------------

--
-- Table structure for table `Comenzi`
--

CREATE TABLE `Comenzi` (
  `ID_Comanda` int(11) NOT NULL,
  `ID_Client` int(11) NOT NULL,
  `Data_Comanda` timestamp NOT NULL DEFAULT current_timestamp(),
  `Status` enum('in procesare','completata','anulata') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Comenzi`
--

INSERT INTO `Comenzi` (`ID_Comanda`, `ID_Client`, `Data_Comanda`, `Status`) VALUES
(1, 1, '2025-01-03 11:39:32', 'in procesare'),
(2, 2, '2025-01-03 11:39:32', 'completata'),
(3, 3, '2025-01-03 11:39:32', 'in procesare'),
(4, 4, '2025-01-03 11:39:32', 'anulata'),
(5, 1, '2025-01-03 11:53:16', 'in procesare'),
(6, 4, '2025-01-03 11:59:38', 'in procesare'),
(7, 2, '2025-01-09 16:45:51', 'in procesare');

-- --------------------------------------------------------

--
-- Table structure for table `Detalii_Comenzi`
--

CREATE TABLE `Detalii_Comenzi` (
  `ID_Detaliu` int(11) NOT NULL,
  `ID_Comanda` int(11) NOT NULL,
  `ID_Produs` int(11) NOT NULL,
  `Cantitate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Detalii_Comenzi`
--

INSERT INTO `Detalii_Comenzi` (`ID_Detaliu`, `ID_Comanda`, `ID_Produs`, `Cantitate`) VALUES
(1, 1, 2, 5),
(2, 1, 3, 2),
(5, 1, 2, 5),
(6, 1, 3, 2),
(7, 2, 1, 10),
(8, 2, 3, 3),
(9, 3, 1, 1),
(10, 3, 2, 4),
(11, 4, 1, 5),
(12, 4, 2, 2),
(13, 5, 2, 10),
(14, 6, 1, 10),
(15, 7, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `Materia_Prima`
--

CREATE TABLE `Materia_Prima` (
  `ID_Materie_Prima` int(11) NOT NULL,
  `Denumire` varchar(100) NOT NULL,
  `Tip_Materie` varchar(50) NOT NULL,
  `Cantitate_Disponibila` int(11) NOT NULL,
  `Furnizor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Materia_Prima`
--

INSERT INTO `Materia_Prima` (`ID_Materie_Prima`, `Denumire`, `Tip_Materie`, `Cantitate_Disponibila`, `Furnizor`) VALUES
(1, 'PVC alb', 'PVC', 5000, 'Furnizor PVC SRL'),
(2, 'Geam termoizolant', 'Geam', 2000, 'Furnizor Geamuri SRL'),
(3, 'Profile PVC', 'PVC', 3000, 'Furnizor Profile SRL');

-- --------------------------------------------------------

--
-- Table structure for table `Productie`
--

CREATE TABLE `Productie` (
  `ID_Productie` int(11) NOT NULL,
  `ID_Produs` int(11) DEFAULT NULL,
  `ID_Materie_Prima` int(11) DEFAULT NULL,
  `Cantitate_Consumata` int(11) NOT NULL,
  `Data_Inceput` datetime NOT NULL,
  `Durata_Productie` int(11) DEFAULT NULL,
  `Status` enum('in desfasurare','finalizat') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Productie`
--

INSERT INTO `Productie` (`ID_Productie`, `ID_Produs`, `ID_Materie_Prima`, `Cantitate_Consumata`, `Data_Inceput`, `Durata_Productie`, `Status`) VALUES
(1, 1, 1, 50, '2024-12-01 00:00:00', 20, 'finalizat'),
(3, 3, 1, 120, '2024-12-10 14:00:00', 24, 'finalizat'),
(4, 2, 1, 20, '2024-12-30 00:00:00', 12, 'in desfasurare'),
(5, 1, NULL, 10, '2025-01-04 17:22:46', NULL, 'in desfasurare'),
(6, 1, NULL, 10, '2025-01-04 17:22:48', NULL, 'in desfasurare'),
(7, 2, NULL, 10, '2025-01-04 17:29:08', NULL, 'in desfasurare'),
(8, 3, NULL, 10, '2025-01-04 17:31:42', NULL, 'in desfasurare'),
(9, 3, NULL, 20, '2025-01-04 17:42:38', NULL, 'in desfasurare'),
(10, 2, NULL, 10, '2025-01-08 20:19:56', NULL, 'in desfasurare'),
(11, 1, NULL, 10, '2025-01-09 18:19:34', NULL, 'in desfasurare'),
(12, 3, NULL, 1, '2025-01-09 18:25:27', NULL, 'in desfasurare'),
(13, 2, NULL, 12, '2025-01-09 18:26:02', NULL, 'in desfasurare'),
(14, 3, NULL, 10, '2025-01-09 18:30:32', NULL, 'in desfasurare');

-- --------------------------------------------------------

--
-- Table structure for table `Product_Raw_Material`
--

CREATE TABLE `Product_Raw_Material` (
  `ID_Produs` int(11) NOT NULL,
  `ID_Materie_Prima` int(11) NOT NULL,
  `Cantitate_Necesara` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Product_Raw_Material`
--

INSERT INTO `Product_Raw_Material` (`ID_Produs`, `ID_Materie_Prima`, `Cantitate_Necesara`) VALUES
(1, 1, 10),
(1, 2, 5),
(2, 1, 8),
(3, 2, 12);

-- --------------------------------------------------------

--
-- Table structure for table `Produse_Finite`
--

CREATE TABLE `Produse_Finite` (
  `ID_Produs` int(11) NOT NULL,
  `Denumire` varchar(100) NOT NULL,
  `Descriere` text DEFAULT NULL,
  `Dimensiuni` varchar(50) NOT NULL,
  `Tip_Produs` varchar(50) NOT NULL,
  `Cantitate_Stoc` int(11) NOT NULL,
  `Pret_Unitar` decimal(10,2) NOT NULL,
  `Status_Produs` enum('activ','inactiv') NOT NULL,
  `Durata_Productie` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Produse_Finite`
--

INSERT INTO `Produse_Finite` (`ID_Produs`, `Denumire`, `Descriere`, `Dimensiuni`, `Tip_Produs`, `Cantitate_Stoc`, `Pret_Unitar`, `Status_Produs`, `Durata_Productie`) VALUES
(1, 'Fereastră PVC', 'Fereastră cu două canate și geam termoizolant', '120x150 cm', 'Fereastră', 20, 350.00, 'activ', 24),
(2, 'Ușă PVC', 'Ușă simplă cu toc din PVC', '80x200 cm', 'Ușă', 50, 420.00, 'activ', 12),
(3, 'Fereastră cu jaluzele', 'Fereastră cu jaluzele integrate', '100x120 cm', 'Fereastră', 50, 450.00, 'inactiv', 48),
(4, 'Fereastră PVC', 'Fereastră cu trei canate și geam termoizolant', '150x150 cm', 'Fereastră', 50, 450.00, 'activ', 30),
(7, 'Ușă de balcon PVC', 'Ușă de balcon cu deschidere glisantă și geam termoizolant', '180x210 cm', 'Ușă', 30, 550.00, 'activ', 35);

-- --------------------------------------------------------

--
-- Table structure for table `Stocuri`
--

CREATE TABLE `Stocuri` (
  `ID_Stoc` int(11) NOT NULL,
  `Tip_Resursa` enum('produs finit','materie prima') NOT NULL,
  `ID_Materie_Prima` int(11) DEFAULT NULL,
  `ID_Produs` int(11) DEFAULT NULL,
  `Cantitate_Disponibila` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Stocuri`
--

INSERT INTO `Stocuri` (`ID_Stoc`, `Tip_Resursa`, `ID_Materie_Prima`, `ID_Produs`, `Cantitate_Disponibila`) VALUES
(5, 'materie prima', 1, NULL, 680),
(6, 'materie prima', 2, NULL, 300),
(7, 'produs finit', NULL, 1, 120),
(8, 'produs finit', NULL, 2, 80);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Clienti`
--
ALTER TABLE `Clienti`
  ADD PRIMARY KEY (`ID_Client`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `Comenzi`
--
ALTER TABLE `Comenzi`
  ADD PRIMARY KEY (`ID_Comanda`),
  ADD KEY `ID_Client` (`ID_Client`);

--
-- Indexes for table `Detalii_Comenzi`
--
ALTER TABLE `Detalii_Comenzi`
  ADD PRIMARY KEY (`ID_Detaliu`),
  ADD KEY `ID_Comanda` (`ID_Comanda`),
  ADD KEY `ID_Produs` (`ID_Produs`);

--
-- Indexes for table `Materia_Prima`
--
ALTER TABLE `Materia_Prima`
  ADD PRIMARY KEY (`ID_Materie_Prima`);

--
-- Indexes for table `Productie`
--
ALTER TABLE `Productie`
  ADD PRIMARY KEY (`ID_Productie`),
  ADD KEY `ID_Produs` (`ID_Produs`),
  ADD KEY `ID_Materie_Prima` (`ID_Materie_Prima`);

--
-- Indexes for table `Product_Raw_Material`
--
ALTER TABLE `Product_Raw_Material`
  ADD PRIMARY KEY (`ID_Produs`,`ID_Materie_Prima`),
  ADD KEY `ID_Materie_Prima` (`ID_Materie_Prima`);

--
-- Indexes for table `Produse_Finite`
--
ALTER TABLE `Produse_Finite`
  ADD PRIMARY KEY (`ID_Produs`);

--
-- Indexes for table `Stocuri`
--
ALTER TABLE `Stocuri`
  ADD PRIMARY KEY (`ID_Stoc`),
  ADD KEY `ID_Materie_Prima` (`ID_Materie_Prima`),
  ADD KEY `ID_Produs` (`ID_Produs`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Clienti`
--
ALTER TABLE `Clienti`
  MODIFY `ID_Client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Comenzi`
--
ALTER TABLE `Comenzi`
  MODIFY `ID_Comanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Detalii_Comenzi`
--
ALTER TABLE `Detalii_Comenzi`
  MODIFY `ID_Detaliu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `Materia_Prima`
--
ALTER TABLE `Materia_Prima`
  MODIFY `ID_Materie_Prima` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Productie`
--
ALTER TABLE `Productie`
  MODIFY `ID_Productie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Produse_Finite`
--
ALTER TABLE `Produse_Finite`
  MODIFY `ID_Produs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Stocuri`
--
ALTER TABLE `Stocuri`
  MODIFY `ID_Stoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comenzi`
--
ALTER TABLE `Comenzi`
  ADD CONSTRAINT `comenzi_ibfk_1` FOREIGN KEY (`ID_Client`) REFERENCES `Clienti` (`ID_Client`);

--
-- Constraints for table `Detalii_Comenzi`
--
ALTER TABLE `Detalii_Comenzi`
  ADD CONSTRAINT `detalii_comenzi_ibfk_1` FOREIGN KEY (`ID_Comanda`) REFERENCES `Comenzi` (`ID_Comanda`),
  ADD CONSTRAINT `detalii_comenzi_ibfk_2` FOREIGN KEY (`ID_Produs`) REFERENCES `Produse_Finite` (`ID_Produs`);

--
-- Constraints for table `Productie`
--
ALTER TABLE `Productie`
  ADD CONSTRAINT `productie_ibfk_1` FOREIGN KEY (`ID_Produs`) REFERENCES `Produse_Finite` (`ID_Produs`),
  ADD CONSTRAINT `productie_ibfk_2` FOREIGN KEY (`ID_Materie_Prima`) REFERENCES `Materia_Prima` (`ID_Materie_Prima`);

--
-- Constraints for table `Product_Raw_Material`
--
ALTER TABLE `Product_Raw_Material`
  ADD CONSTRAINT `product_raw_material_ibfk_1` FOREIGN KEY (`ID_Produs`) REFERENCES `Produse_Finite` (`ID_Produs`),
  ADD CONSTRAINT `product_raw_material_ibfk_2` FOREIGN KEY (`ID_Materie_Prima`) REFERENCES `Stocuri` (`ID_Materie_Prima`);

--
-- Constraints for table `Stocuri`
--
ALTER TABLE `Stocuri`
  ADD CONSTRAINT `stocuri_ibfk_1` FOREIGN KEY (`ID_Materie_Prima`) REFERENCES `Materia_Prima` (`ID_Materie_Prima`),
  ADD CONSTRAINT `stocuri_ibfk_2` FOREIGN KEY (`ID_Produs`) REFERENCES `Produse_Finite` (`ID_Produs`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
