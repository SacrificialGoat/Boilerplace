-- MySQL dump 10.13  Distrib 5.6.19, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: virtual_arm
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `forum_threads`
--

DROP TABLE IF EXISTS `forum_threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forum_threads` (
  `thread_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `title` varchar(100) DEFAULT '',
  `body` text,
  `link` varchar(200) DEFAULT '',
  `tag` varchar(25) DEFAULT '',
  `post_count` int(10) DEFAULT '0',
  `rating` int(10) DEFAULT '0',
  `longitude` decimal(15,7) DEFAULT '0.0000000',
  `latitude` decimal(15,7) DEFAULT '0.0000000',
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_post_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`thread_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `forum_threads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_threads`
--

LOCK TABLES `forum_threads` WRITE;
/*!40000 ALTER TABLE `forum_threads` DISABLE KEYS */;
INSERT INTO `forum_threads` VALUES (1,3,'Ebola vaccine is \'potential game-changer\'','A vaccine against the deadly Ebola virus has led to 100% protection and could transform the way Ebola is tackled, preliminary results suggest.','http://www.bbc.com/news/health-33733711','news',2,2,-122.4090500,37.7837973,'2015-07-31 22:53:28','2015-07-31 23:37:21','2015-07-31 23:37:21'),(2,3,'We told the king we had HIV','For the last few years, Wangda Dorje and Tshering Choden have been the public face of HIV/Aids in Bhutan.','http://www.bbc.com/news/magazine-33697521','media',0,0,-122.4110414,37.7738280,'2015-07-31 23:01:10','2015-07-31 23:01:10','2015-07-31 23:01:10'),(3,3,'Terror on the beach','The world watched in horror last month as gunman Seifeddine Rezgui killed 38 people at the Tunisian resort of Sousse.','http://www.bbc.com/news/magazine-33611482','news',0,0,-122.4105110,37.7738286,'2015-07-31 23:02:29','2015-07-31 23:02:29','2015-07-31 23:02:29'),(4,3,'MH370 search: Plane debris flown out of Reunion','A piece of debris that experts believe could be from missing flight MH370 has been flown out of the French island where it was found on Wednesday.','http://www.bbc.com/news/world-europe-33739851','europe',0,0,-122.4110521,37.7938045,'2015-07-31 23:27:38','2015-07-31 23:27:38','2015-07-31 23:27:38'),(5,3,'Ten books to read in August','From the memoir of a Nobel Laureate to a journalist’s account of living with nomads in West Africa, these are titles worthy of adding to your bookshelf, writes Jane Ciabattari.','http://www.bbc.com/culture/story/20150731-ten-books-to-read-in-august','books',0,0,-122.4090491,37.7938001,'2015-07-31 23:28:30','2015-07-31 23:28:30','2015-07-31 23:28:30'),(6,3,'No man\'s sky','ask-sean-murray-anything-about-no-mans-sky','http://www.ign.com/articles/2015/07/24/ask-sean-murray-anything-about-no-mans-sky','games',0,0,-122.4090367,37.7537994,'2015-07-31 23:29:46','2015-07-31 23:29:46','2015-07-31 23:29:46'),(7,1,'Redirection with React Router Component','I\'m having a problem with react-router-component. I\'m trying to make a redirect library that does a \"soft\" redirect','http://stackoverflow.com/questions/25374945/redirection-with-react-router-component','coding',0,0,-122.4102870,37.7838078,'2015-07-31 23:33:19','2015-07-31 23:33:19','2015-07-31 23:33:19'),(8,1,'8 ton Orca jumps nearly 20 ft out of the water.','Orca whale','http://i.imgur.com/RyT5qcj.jpg','nature',0,0,-122.4110405,37.7937932,'2015-07-31 23:36:55','2015-07-31 23:36:55','2015-07-31 23:36:55'),(9,1,'A man being a man in the 90s!','It\'s a great picture!','http://imgur.com/FAfvLJR','media',0,0,-122.4099368,37.7857941,'2015-07-31 23:40:06','2015-07-31 23:40:06','2015-07-31 23:40:06'),(10,1,'Charleston gunman pleads not guilty to federal charges','The man accused of murdering nine black churchgoers last month in Charleston, South Carolina, has pleaded not guilty on more than 33 federal charges.','http://www.bbc.com/news/world-us-canada-33737244','news',0,0,-122.4197970,37.7823310,'2015-07-31 23:41:40','2015-07-31 23:41:40','2015-07-31 23:41:40');
/*!40000 ALTER TABLE `forum_threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `user_id` int(10) NOT NULL DEFAULT '0',
  `friend_id` int(10) NOT NULL DEFAULT '0',
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `message_id` int(10) NOT NULL AUTO_INCREMENT,
  `sender_id` int(10) DEFAULT NULL,
  `recipient_id` int(10) DEFAULT NULL,
  `title` varchar(100) DEFAULT '',
  `contents` text,
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `recipient_id` (`recipient_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_votes`
--

DROP TABLE IF EXISTS `post_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_votes` (
  `post_id` int(10) NOT NULL DEFAULT '0',
  `user_id` int(10) NOT NULL DEFAULT '0',
  `score` tinyint(1) DEFAULT '0',
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `post_votes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `thread_posts` (`post_id`),
  CONSTRAINT `post_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_votes`
--

LOCK TABLES `post_votes` WRITE;
/*!40000 ALTER TABLE `post_votes` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_votes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thread_posts`
--

DROP TABLE IF EXISTS `thread_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thread_posts` (
  `post_id` int(10) NOT NULL AUTO_INCREMENT,
  `thread_id` int(10) DEFAULT NULL,
  `user_id` int(10) DEFAULT NULL,
  `contents` text,
  `rating` int(10) DEFAULT '0',
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `thread_id` (`thread_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `thread_posts_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`thread_id`),
  CONSTRAINT `thread_posts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thread_posts`
--

LOCK TABLES `thread_posts` WRITE;
/*!40000 ALTER TABLE `thread_posts` DISABLE KEYS */;
INSERT INTO `thread_posts` VALUES (1,1,3,'Wow!',0,'2015-07-31 23:26:42','2015-07-31 23:26:42'),(2,1,1,'adsf',0,'2015-07-31 23:37:21','2015-07-31 23:37:21');
/*!40000 ALTER TABLE `thread_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thread_votes`
--

DROP TABLE IF EXISTS `thread_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thread_votes` (
  `thread_id` int(10) NOT NULL DEFAULT '0',
  `user_id` int(10) NOT NULL DEFAULT '0',
  `score` tinyint(1) DEFAULT '0',
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`thread_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `thread_votes_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`thread_id`),
  CONSTRAINT `thread_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thread_votes`
--

LOCK TABLES `thread_votes` WRITE;
/*!40000 ALTER TABLE `thread_votes` DISABLE KEYS */;
INSERT INTO `thread_votes` VALUES (1,1,1,'2015-07-31 23:37:19','2015-07-31 23:37:19'),(1,3,1,'2015-07-31 23:00:06','2015-07-31 23:00:06');
/*!40000 ALTER TABLE `thread_votes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(25) DEFAULT '',
  `first_name` varchar(25) DEFAULT '',
  `last_name` varchar(25) DEFAULT '',
  `password_hash` varchar(80) DEFAULT '',
  `is_disabled` tinyint(1) DEFAULT '0',
  `bio` varchar(500) DEFAULT '',
  `rep` int(10) DEFAULT '0',
  `avatar_link` varchar(200) DEFAULT '',
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mike','Mike','Kim','$2a$10$5/3WWS8axQ9v9iCZdsNVjeTOKPtQe2jbcqyHfeiV.4CSa0/X83a4.',0,'pusheen lover <3',0,'http://images5.fanpop.com/image/photos/24800000/Pusheen-pusheen-the-cat-24896924-140-150.gif','2015-07-31 21:28:32','2015-07-31 23:49:06'),(2,'andrew','Andrew','Li','$2a$10$CsXGaCN1LcaPftZUAtNshO1u85K5S1VUGS5khIXJ.Et8NQbtoCsOK',0,'',0,'','2015-07-31 21:36:59','2015-07-31 21:36:59'),(3,'mikemsrk','Mike','Kim','$2a$10$KP8M0k8H/ev1//Lf18JkketYHq6X7mJ/IQHgsiHZlBIyXRrAHurSe',0,'pups.',4,'http://i.imgur.com/Lk9ye2X.jpg','2015-07-31 22:52:21','2015-07-31 23:37:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-01  2:47:32
