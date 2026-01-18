import re
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

def clean_text(text):
    # Basic cleaning
    text = text.lower().strip()
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return lines

def detect_repeated_lines(lines):
    # Count occurrences of each line
    line_counts = Counter(lines)
    repeated_lines = [line for line, count in line_counts.items() if count > 1]
    return repeated_lines

def group_lines_by_similarity(lines, n_clusters=3):
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(lines)
    
    # KMeans clustering to identify similar lines
    kmeans = KMeans(n_clusters=n_clusters, random_state=0).fit(X)
    clusters = kmeans.labels_
    
    grouped_lines = {i: [] for i in range(n_clusters)}
    for i, label in enumerate(clusters):
        grouped_lines[label].append(lines[i])
    
    return grouped_lines

def categorize_sections(lines, repeated_lines):
    verses = []
    choruses = []
    bridges = []
    
    for line in lines:
        if line in repeated_lines:
            choruses.append(line)
        else:
            verses.append(line)
    
    # Assuming the bridge is the shortest unique section (experimental)
    if len(verses) > 2:
        bridges = [verses.pop(-1)]
    
    return verses, choruses, bridges

def format_output(verses, choruses, bridges):
    output = "\n\nGenerated Song Structure:\n\n"
    
    output += "Verse 1:\n" + '\n'.join(verses[:4]) + "\n\n"
    output += "Chorus:\n" + '\n'.join(choruses) + "\n\n"
    if bridges:
        output += "Bridge:\n" + '\n'.join(bridges) + "\n\n"
    if len(verses) > 4:
        output += "Verse 2:\n" + '\n'.join(verses[4:]) + "\n"
    
    return output

if __name__ == "__main__":
    # Sample lyrics input
    lyrics = """
    I see the sunrise over mountains high,
    Lost in dreams as the world goes by,
    Chasing shadows in the sky,
    Hoping to find where my heart can lie.

    But every road leads me back to you,
    In the night when the stars are few,
    Through the dark, I see your light,
    Guiding me home through the endless night.

    I feel your love like a melody,
    Pulling me back when I'm lost at sea,
    No matter how far I roam,
    Your love is where I belong.
    """

    lines = clean_text(lyrics)
    repeated_lines = detect_repeated_lines(lines)
    verses, choruses, bridges = categorize_sections(lines, repeated_lines)
    result = format_output(verses, choruses, bridges)
    
    print(result)