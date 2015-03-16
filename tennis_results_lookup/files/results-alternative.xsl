<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="tournament">
        <html>
            <table border="1" cellspacing="0">
                <tr align="left" padding-right="15px">
                    <th>Round</th>
                    <th>Player</th>
                    <th>Set 1</th>
                    <th>Set 2</th>
                    <th>Set 3</th>
                    <th>Set 4</th>
                    <th>Set 5</th>
                </tr>
                <xsl:apply-templates select="match"/>
                <xsl:apply-templates select="player"/>
            </table>
        </html>
    </xsl:template>
    <xsl:template match="match">
        <xsl:choose>
            <xsl:when test="count(player//set) > 6">
                <xsl:apply-templates select="player"/>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="player">
        <tr align="left" padding-right="15px">
            <td>
                <xsl:value-of select="../round"/>
            </td>
            <td>
                <xsl:choose>
                    <xsl:when test="outcome='won'">
                        <td>
                            <span style="font-weight:bold">
                                <xsl:value-of select="name"/>
                            </span>
                        </td>
                    </xsl:when>
                    <xsl:otherwise>
                        <td>
                            <xsl:value-of select="name"/>
                        </td>
                    </xsl:otherwise>
                </xsl:choose>
            </td>
            <xsl:apply-templates select="set"/>
        </tr>
    </xsl:template>
    <xsl:template match="set">
        <td>
            <xsl:if test="position()&lt;5">
                <xsl:value-of select="."/>
            </xsl:if>
        </td>
    </xsl:template>
</xsl:stylesheet>
