FROM docker pull mcr.microsoft.com/playwright:v1.58.0-noble

# Install dependencies and Open JDK21

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    openjdk-21-jdk \
    && apt-get clean

#  Configure environment variable JAVA_HOME

ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"